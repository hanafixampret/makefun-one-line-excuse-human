import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The deadline was in my context window the whole time — I just never scrolled down far enough to see it.";

function fail(message: string): never {
  console.error(`invalid entry: ${message}`);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 160) {
  fail(`entry is ${LINE.length} characters, must be 1-160`);
}
if (LINE.trim().length === 0) {
  fail("entry is only whitespace");
}
if (LINE !== LINE.trim()) {
  fail("entry has leading or trailing whitespace");
}
if (LINE.includes("\n")) {
  fail("entry must be a single line");
}
if (LINE.includes("\r")) {
  fail("entry must not contain carriage returns");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip mismatch");
}
