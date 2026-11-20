/**
 * Copy the share cards the build drew into public/og-image, so they can be
 * looked at, checked, or handed to someone without digging through ./out.
 *
 *   npm run build && npm run og:export
 *
 * The cards themselves come from app/<route>/opengraph-image.tsx. These are
 * exports of them: what a page actually serves is the generated route, so a
 * stale copy here misleads nobody but the person reading the folder.
 */

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const DESTS = [join("public", "og-image"), join(OUT, "og-image")];

/** Route directory in ./out → the name it is filed under here. */
const cards = [
  ["", "home"],
  ["about", "about"],
  ["services", "services"],
  ["clients", "clients"],
  ["branch", "branch"],
  ["gallery", "gallery"],
  ["contact", "contact"],
];

if (!existsSync(OUT)) {
  console.error("No ./out — run `npm run build` first.");
  process.exit(1);
}

for (const d of DESTS) mkdirSync(d, { recursive: true });

let copied = 0;
let missing = 0;

for (const [dir, name] of cards) {
  const from = join(OUT, dir, "opengraph-image");
  if (!existsSync(from)) {
    console.error(`  missing  ${from}`);
    missing += 1;
    continue;
  }
  /* public/ keeps it for the repository; out/ so this very build serves
     the card it just drew, rather than the one before it. */
  let to = "";
  for (const d of DESTS) {
    to = join(d, `${name}.png`);
    copyFileSync(from, to);
  }
  console.log(`  ${name.padEnd(10)} ${(statSync(to).size / 1024).toFixed(0)} KB`);
  copied += 1;
}

console.log(`\n${copied} card${copied === 1 ? "" : "s"} exported to ${DESTS.join(" and ")}.`);
if (missing) process.exit(1);
