import { auth, currentUser } from "@clerk/nextjs/server";
import { hasPermission, getRole } from "@/utils/permissions";
import { getSiteData } from "@/utils/site-data";
import { DAY_INDEX } from "@/utils/session-groups";
import {
    HOLIDAYS_COVERED_UNTIL,
    SCHOOL_FREE_DAYS,
} from "@/utils/school-holidays";

export const dynamic = "force-dynamic";

const TZ = "Europe/Zurich";
const BYDAY = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const VTIMEZONE = [
    "BEGIN:VTIMEZONE",
    `TZID:${TZ}`,
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
];

/** Parses free text like "18:00 – 20:00" into minutes since midnight. */
function parseTimes(time: string): { start: number; end: number } | null {
    const m = time.match(/(\d{1,2})[:.](\d{2})\D+(\d{1,2})[:.](\d{2})/);
    if (!m) return null;
    const start = Number(m[1]) * 60 + Number(m[2]);
    const end = Number(m[3]) * 60 + Number(m[4]);
    if (end <= start || start >= 1440 || end > 1440) return null;
    return { start, end };
}

const pad = (n: number) => String(n).padStart(2, "0");
const DAY_MS = 86_400_000;

/** Formats an ISO date (YYYY-MM-DD) plus minutes since midnight as a local ICS timestamp. */
function stamp(isoDate: string, minutes: number): string {
    return `${isoDate.replace(/-/g, "")}T${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}00`;
}

function escapeText(s: string): string {
    return s
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r?\n/g, "\\n");
}

/** Folds lines to 75 octets as required by RFC 5545. */
function fold(line: string): string {
    const bytes = Buffer.from(line, "utf8");
    if (bytes.length <= 75) return line;
    const parts: string[] = [];
    let current = "";
    let size = 0;
    for (const ch of line) {
        const len = Buffer.byteLength(ch);
        const limit = parts.length === 0 ? 75 : 74;
        if (size + len > limit) {
            parts.push(current);
            current = "";
            size = 0;
        }
        current += ch;
        size += len;
    }
    parts.push(current);
    return parts.join("\r\n ");
}

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const user = await currentUser();
    const role = getRole(user?.publicMetadata as Record<string, unknown>);
    if (!hasPermission(role, "mitglieder:access")) {
        return new Response("Forbidden", { status: 403 });
    }

    const { training } = await getSiteData();
    const now = new Date();
    // Today's date in Zurich (sv-SE gives YYYY-MM-DD).
    const today = now.toLocaleDateString("sv-SE", { timeZone: TZ });
    const dtstamp = `${now.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;

    const events: string[] = [];
    for (const s of training.sessions) {
        const dayIndex = DAY_INDEX[s.day];
        const times = parseTimes(s.time);
        if (dayIndex === undefined || !times) continue;

        // Walk the weekly occurrences (in UTC date arithmetic, so the server's
        // timezone and DST never shift the day) and skip school-free days.
        const todayUtc = Date.parse(today);
        const firstUtc =
            todayUtc +
            ((dayIndex - new Date(todayUtc).getUTCDay() + 7) % 7) * DAY_MS;
        const untilUtc = Date.parse(HOLIDAYS_COVERED_UNTIL);

        // DTSTART must itself be a real training day, so start at the first
        // school day; only free days after that become EXDATEs.
        const exdates: string[] = [];
        let firstRun: number | null = null;
        let lastRun = firstUtc;
        for (let t = firstUtc; t <= untilUtc; t += 7 * DAY_MS) {
            const iso = new Date(t).toISOString().slice(0, 10);
            if (SCHOOL_FREE_DAYS.has(iso)) {
                if (firstRun !== null) {
                    exdates.push(`EXDATE;TZID=${TZ}:${stamp(iso, times.start)}`);
                }
            } else {
                firstRun ??= t;
                lastRun = t;
            }
        }
        if (firstRun === null) continue;

        const firstIso = new Date(firstRun).toISOString().slice(0, 10);
        const until = `${new Date(lastRun).toISOString().slice(0, 10).replace(/-/g, "")}T235959Z`;

        const summary = `Parkour Training${s.level ? ` (${s.level})` : ""}`;
        events.push(
            "BEGIN:VEVENT",
            `UID:${s.id}@parkour-baar`,
            `DTSTAMP:${dtstamp}`,
            `DTSTART;TZID=${TZ}:${stamp(firstIso, times.start)}`,
            `DTEND;TZID=${TZ}:${stamp(firstIso, times.end)}`,
            `RRULE:FREQ=WEEKLY;BYDAY=${BYDAY[dayIndex]};UNTIL=${until}`,
            ...exdates,
            `SUMMARY:${escapeText(summary)}`,
            `LOCATION:${escapeText(training.location)}`,
            ...(s.note ? [`DESCRIPTION:${escapeText(s.note)}`] : []),
            "END:VEVENT",
        );
    }

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Parkour Baar//Training//DE",
        "CALSCALE:GREGORIAN",
        "X-WR-CALNAME:Parkour Baar Training",
        ...VTIMEZONE,
        ...events,
        "END:VCALENDAR",
    ];

    return new Response(lines.map(fold).join("\r\n") + "\r\n", {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'attachment; filename="parkour-baar-training.ics"',
            "Cache-Control": "private, no-store",
        },
    });
}
