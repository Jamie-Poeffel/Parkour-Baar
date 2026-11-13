// Prints one value from the root `.env` (surrounding quotes stripped).
// Usage: node scripts/env-value.mjs NEXT_PUBLIC_GA_ID
import { existsSync, readFileSync } from "node:fs";

const key = process.argv[2];
if (!key || !existsSync(".env")) process.exit(0);

for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
  if (m && m[1] === key) {
    process.stdout.write(m[2].replace(/^(['"])(.*)\1$/, "$2"));
    break;
  }
}
