// Single source of truth for app configuration is the root `.env`.
// This script derives the files other tools need from it, so values are never
// copy-pasted between env files:
//
//   terraform-aws/app-secrets.json  <- secret keys below, taken from `.env`
//
// Usage: node scripts/sync-env.mjs
import {
  chmodSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";

const SECRET_KEYS = [
  "CLERK_WEBHOOK_SECRET",
  "CLERK_SECRET_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "AXIOM_TOKEN",
  "FIREBASE_PROJECT_ID",
];

// Not part of the app's .env: the AWS tunnel token lives only in this file.
const KEEP_FROM_EXISTING = ["CLOUDFLARE_TUNNEL_TOKEN"];

function parseEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return out;
}

const env = parseEnv(".env");
const target = "terraform-aws/app-secrets.json";
const existing = existsSync(target)
  ? JSON.parse(readFileSync(target, "utf8"))
  : {};

const missing = SECRET_KEYS.filter((k) => !env[k]);
if (missing.length) {
  console.error(`Missing in .env: ${missing.join(", ")}`);
  process.exit(1);
}

const secrets = Object.fromEntries(SECRET_KEYS.map((k) => [k, env[k]]));
for (const k of KEEP_FROM_EXISTING) if (existing[k]) secrets[k] = existing[k];

// owner-only: this file holds credentials (mode is a no-op on Windows)
writeFileSync(target, JSON.stringify(secrets, null, 4) + "\n", { mode: 0o600 });
chmodSync(target, 0o600);
console.log(`Wrote ${target} (${Object.keys(secrets).length} keys) from .env`);
