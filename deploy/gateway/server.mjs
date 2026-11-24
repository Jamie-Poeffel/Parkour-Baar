// Gateway in front of the Next.js app.
//
//   cloudflared -> gateway (alias "app", :3000) -> web (:3000)
//
// - While a maintenance window from /data/maintenance.json is active it answers
//   every request with the maintenance page (503 + Retry-After). The app
//   container can be stopped, rebuilt or poked at freely meanwhile.
// - If the app is unreachable it serves the same page as a fallback.
// - Around the window it pauses the active UptimeRobot monitors and resumes
//   exactly those afterwards (state in /data/state.json, survives restarts).
//
// No dependencies: runs on a stock node:22-alpine image.

import http from "node:http";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.PORT ?? 3000);
const UPSTREAM = new URL(process.env.UPSTREAM ?? "http://web:3000");
const DATA_DIR = process.env.DATA_DIR ?? "/data";
const TZ = process.env.MAINTENANCE_TZ ?? "Europe/Zurich";
const API_KEY = process.env.UPTIMEROBOT_API_KEY ?? "";
const ONLY_IDS = (process.env.UPTIMEROBOT_MONITOR_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
const PAUSE_LEAD_MS = Number(process.env.PAUSE_LEAD_SECONDS ?? 60) * 1000;
const RESUME_DELAY_MS = Number(process.env.RESUME_DELAY_SECONDS ?? 30) * 1000;
const TICK_MS = 15_000;

const WINDOW_FILE = path.join(DATA_DIR, "maintenance.json");
const STATE_FILE = path.join(DATA_DIR, "state.json");

const log = (msg, extra = {}) =>
    console.log(JSON.stringify({ t: new Date().toISOString(), msg, ...extra }));

// ---------------------------------------------------------------- window ----

let windowCache = { at: 0, value: null };
let lastWindowError = "";

/** @returns {Promise<{from:number,to:number,message:string}|null>} */
async function readWindow() {
    if (Date.now() - windowCache.at < 2000) return windowCache.value;

    let value = null;
    try {
        const raw = JSON.parse(await readFile(WINDOW_FILE, "utf8"));
        const from = Date.parse(raw.from);
        const to = Date.parse(raw.to);
        if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
            throw new Error("'from' and 'to' must be valid dates with to > from");
        }
        value = { from, to, message: String(raw.message ?? "") };
        lastWindowError = "";
    } catch (error) {
        if (error?.code !== "ENOENT") {
            // Fail open: a broken file must never take the site down.
            const text = String(error?.message ?? error);
            if (text !== lastWindowError) log("maintenance.json invalid", { error: text });
            lastWindowError = text;
        }
    }
    windowCache = { at: Date.now(), value };
    return value;
}

const isActive = (w, now = Date.now()) => !!w && now >= w.from && now < w.to;

// ------------------------------------------------------------------ page ----

const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const dateFmt = new Intl.DateTimeFormat("de-CH", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: TZ,
});

function renderPage(w) {
    const until = w ? `<p class="until">Voraussichtlich wieder verfügbar:<br><strong>${escapeHtml(dateFmt.format(w.to))} Uhr</strong></p>` : "";
    const note = w?.message ? `<p>${escapeHtml(w.message)}</p>` : "";
    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Wartungsarbeiten – Parkour Baar</title>
<style>
:root{--bg:#fff;--fg:#141414;--muted:#5c5c5c;--card:#f4f4f2;--accent:#141414}
@media (prefers-color-scheme:dark){:root{--bg:#101010;--fg:#f2f2f0;--muted:#a3a3a0;--card:#1b1b1b;--accent:#f2f2f0}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:520px;width:100%;background:var(--card);border-radius:16px;padding:40px 32px;text-align:center}
h1{margin:0 0 12px;font-size:1.6rem;line-height:1.2}
p{margin:0 0 16px;color:var(--muted)}
.until{color:var(--fg)}
.bar{height:4px;width:64px;margin:0 auto 24px;border-radius:2px;background:var(--accent)}
</style>
</head>
<body>
<main>
<div class="bar"></div>
<h1>Wir sind bald zurück</h1>
<p>Parkour Baar wird gerade gewartet.</p>
${until}${note}
<p>Danke für deine Geduld!</p>
</main>
</body>
</html>`;
}

function sendPage(res, w, now = Date.now()) {
    const retry = w && now < w.to ? Math.max(30, Math.ceil((w.to - now) / 1000)) : 60;
    const body = renderPage(w && now < w.to ? w : null);
    res.writeHead(503, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": String(Math.min(retry, 3600)),
        "x-robots-tag": "noindex",
    });
    res.end(body);
}

// ----------------------------------------------------------------- proxy ----

const agent = new http.Agent({ keepAlive: true });

function proxy(req, res, w) {
    const headers = { ...req.headers };
    const ip = req.socket.remoteAddress ?? "";
    headers["x-forwarded-for"] = headers["x-forwarded-for"] ? `${headers["x-forwarded-for"]}, ${ip}` : ip;

    const upstream = http.request(
        {
            host: UPSTREAM.hostname,
            port: UPSTREAM.port || 80,
            method: req.method,
            path: req.url,
            headers,
            agent,
        },
        (upRes) => {
            res.writeHead(upRes.statusCode ?? 502, upRes.headers);
            upRes.pipe(res);
        },
    );
    upstream.setTimeout(60_000, () => upstream.destroy(new Error("upstream timeout")));
    upstream.on("error", (error) => {
        if (!res.headersSent) sendPage(res, w);
        else res.destroy();
        log("upstream error", { error: error.message, url: req.url });
    });
    res.on("close", () => upstream.destroy());
    req.pipe(upstream);
}

/** "http" / "https" as the visitor used it, or null when unknown. */
function visitorProtocol(req) {
    const forwarded = String(req.headers["x-forwarded-proto"] ?? "")
        .split(",")[0]
        .trim()
        .toLowerCase();
    if (forwarded === "http" || forwarded === "https") return forwarded;
    try {
        const scheme = JSON.parse(String(req.headers["cf-visitor"] ?? "{}")).scheme;
        if (scheme === "http" || scheme === "https") return scheme;
    } catch {
        /* ignore malformed header */
    }
    return null;
}

const server = http.createServer(async (req, res) => {
    if (req.url === "/__gateway/health") {
        res.writeHead(200, { "content-type": "text/plain", "cache-control": "no-store" });
        return res.end("ok");
    }
    // Enforce HTTPS. TLS ends at Cloudflare, which tells us the visitor's
    // protocol in X-Forwarded-Proto / CF-Visitor. Only an explicit "http" is
    // redirected, so local and in-container requests (no header) still work.
    if (visitorProtocol(req) === "http" && req.headers.host) {
        res.writeHead(308, {
            location: `https://${req.headers.host}${req.url}`,
            "cache-control": "no-store",
        });
        return res.end();
    }
    const w = await readWindow();
    if (isActive(w)) return sendPage(res, w);
    proxy(req, res, w);
});

// ------------------------------------------------------------ uptimerobot ----

let state = { paused: [], pausedFor: "" };

async function loadState() {
    try {
        state = { ...state, ...JSON.parse(await readFile(STATE_FILE, "utf8")) };
    } catch {}
}

async function saveState() {
    const tmp = `${STATE_FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(state, null, 2));
    await rename(tmp, STATE_FILE);
}

async function api(method, params = {}) {
    const response = await fetch(`${process.env.UPTIMEROBOT_API_URL ?? "https://api.uptimerobot.com/v2"}/${method}`, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", "cache-control": "no-cache" },
        body: new URLSearchParams({ api_key: API_KEY, format: "json", ...params }),
        signal: AbortSignal.timeout(15_000),
    });
    const json = await response.json().catch(() => ({}));
    if (json.stat !== "ok") {
        const error = new Error(`UptimeRobot ${method}: ${json.error?.message ?? response.status}`);
        error.type = json.error?.type;
        throw error;
    }
    return json;
}

async function listMonitors() {
    const monitors = [];
    for (let offset = 0; ; offset += 50) {
        const page = await api("getMonitors", { limit: "50", offset: String(offset) });
        monitors.push(...page.monitors);
        if (offset + 50 >= (page.pagination?.total ?? 0)) return monitors;
    }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pauseMonitors(key) {
    // status 0 = already paused: not ours to touch, and not ours to resume.
    const targets = (await listMonitors()).filter(
        (m) => m.status !== 0 && (ONLY_IDS.length === 0 || ONLY_IDS.includes(String(m.id))),
    );
    for (const m of targets) {
        await api("editMonitor", { id: String(m.id), status: "0" });
        state.paused = [...new Set([...state.paused, String(m.id)])];
        await saveState();
        log("monitor paused", { id: m.id, name: m.friendly_name });
        await sleep(700);
    }
    state.pausedFor = key;
    await saveState();
}

async function resumeMonitors() {
    for (const id of [...state.paused]) {
        try {
            await api("editMonitor", { id, status: "1" });
            log("monitor resumed", { id });
        } catch (error) {
            if (error.type !== "not_found") throw error; // otherwise retry next tick
            log("monitor gone, dropping", { id });
        }
        state.paused = state.paused.filter((p) => p !== id);
        await saveState();
        await sleep(700);
    }
    state.pausedFor = "";
    await saveState();
}

let ticking = false;
let warnedNoKey = false;

async function tick() {
    if (ticking) return;
    ticking = true;
    try {
        windowCache.at = 0;
        const w = await readWindow();
        const now = Date.now();
        const wantPaused = !!w && now >= w.from - PAUSE_LEAD_MS && now < w.to + RESUME_DELAY_MS;

        if (wantPaused) {
            const key = `${w.from}|${w.to}`;
            if (state.pausedFor === key) return;
            if (!API_KEY) {
                if (!warnedNoKey) log("UPTIMEROBOT_API_KEY not set: monitors will not be paused");
                warnedNoKey = true;
                return;
            }
            await pauseMonitors(key);
        } else if (state.paused.length > 0 || state.pausedFor) {
            if (!API_KEY) return;
            await resumeMonitors();
        }
    } catch (error) {
        log("uptimerobot sync failed, retrying", { error: error.message });
    } finally {
        ticking = false;
    }
}

await loadState();
server.listen(PORT, "0.0.0.0", () => log("gateway listening", { port: PORT, upstream: UPSTREAM.origin }));
setInterval(tick, TICK_MS);
tick();
