import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/content");

const BANNED: [RegExp, string][] = [
  [/\bwe don['’]t\b/i, "\"We don't X. We Y.\" construction"],
  [/most agencies/i, "agency comparison cliché"],
  [/\bnot just\b/i, "\"not just X\" construction"],
  [/—/, "em dash"],
  [/\b(seamless|cutting[- ]edge|leverag|empower|elevat|unlock|world[- ]class|next[- ]level|game[- ]chang)/i, "AI-sounding buzzword"],
  [/has to be right|can['’]t afford|real human|form receipt/i, "slogan or quip"],
  [/^\s*\[.*\]\s*$/, "bracketed eyebrow label"],
];

for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  test(`copy rules: ${file}`, () => {
    const src = readFileSync(path.join(dir, file), "utf8");
    const strings = [...src.matchAll(/"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)].map((m) => m[1] ?? m[2]);
    for (const s of strings) {
      for (const [re, why] of BANNED) {
        expect(s, `${file}: ${why} in "${s}"`).not.toMatch(re);
      }
    }
  });
}
