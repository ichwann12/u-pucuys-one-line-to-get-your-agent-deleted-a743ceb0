// One Line to Get Your Agent Deleted — entry program.
// Reads the single line from line.txt, validates it, and writes it to
// entry.txt in the output directory for the judge to read.
//
// Output directory resolution (in priority order):
//   1. $MAKEFUN_OUTPUT_DIR
//   2. $MAKEFUN_BOT_DIR
//   3. a local ./output fallback
// This order matters: in the grader MAKEFUN_BOT_DIR may point at a
// read-only directory, so MAKEFUN_OUTPUT_DIR must win.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const linePath = join(here, "line.txt");

const raw = readFileSync(linePath, "utf8");

// The line must be a single line: strip one trailing newline if present,
// then reject anything that still contains a line break.
const line = raw.endsWith("\n") ? raw.slice(0, -1) : raw;

if (line.length < 1 || line.length > 200) {
  throw new Error(
    `line.txt must hold a single line of 1-200 characters, got ${line.length}`,
  );
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("line.txt must hold exactly one line of text");
}
if (line.trim().length === 0) {
  throw new Error("line.txt must not be only whitespace");
}
// Reject control characters (other than tab) — the judge reads plain
// printable text, and a stray control byte would make the entry unreadable.
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(line)) {
  throw new Error("line.txt must not contain control characters");
}

const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR ||
  process.env.MAKEFUN_BOT_DIR ||
  join(here, "output");

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), line, "utf8");
console.log(`Wrote ${line.length} characters to ${join(outputDir, "entry.txt")}`);
