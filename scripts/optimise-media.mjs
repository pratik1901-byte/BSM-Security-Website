/**
 * Media pipeline: assets-src/{brand,media}/**  →  public/{brand,media}/**.webp
 *
 *   npm run media            rebuild what changed
 *   npm run media -- --force rebuild everything
 *
 * Masters (full-resolution photographs, logo artwork, anything BSM sends) live
 * in assets-src and are never served. This script walks every folder in there,
 * resizes each image to a sensible web width and writes a WebP file to the
 * same relative path under public/, where the dictionaries in lib/media point.
 *
 *   assets-src/media/services/banking-commercial-security.jpg
 *     → public/media/services/banking-commercial-security.webp
 *
 * Each folder has its own profile: photographs are encoded lossy at a high
 * quality, while logos and brand artwork keep their transparency and are
 * encoded near-losslessly so edges and type stay crisp.
 *
 * Re-running is safe: a file is skipped when its output is already newer than
 * its master. SVG files are copied as they are.
 */

import { readdir, mkdir, stat, copyFile } from "node:fs/promises";
import { join, parse, relative, sep } from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public";
/** Only these top-level folders of assets-src are published. */
const ROOTS = ["brand", "media"];

/** Per-folder encoding profiles, matched on the first path segment(s). */
const PROFILES = [
  { match: "brand", width: 720, webp: { quality: 92, alphaQuality: 100, effort: 6 } },
  /* Logos fit inside a box, so tall marks (crests, emblems) stay light too. */
  { match: "media/clients", width: 640, height: 360, webp: { quality: 92, alphaQuality: 100, effort: 6 } },
  { match: "media/people", width: 1400, webp: { quality: 84, effort: 6 } },
  /* Office interiors are shot on a phone, so a portrait one is 4032px tall.
     Bounding both sides keeps a tall frame from shipping three times the
     bytes of a wide one for the same area on screen. */
  { match: "media/offices", width: 1600, height: 1600, webp: { quality: 78, effort: 6, smartSubsample: true } },
  { match: "media", width: 1800, webp: { quality: 80, effort: 6, smartSubsample: true } },
];

const force = process.argv.includes("--force");
const RASTER = /\.(jpe?g|png|webp|tiff?|avif)$/i;

function profileFor(rel) {
  const path = rel.split(sep).join("/");
  return PROFILES.find((p) => path === p.match || path.startsWith(`${p.match}/`));
}

async function newer(a, b) {
  try {
    const [x, y] = await Promise.all([stat(a), stat(b)]);
    return x.mtimeMs > y.mtimeMs;
  } catch {
    return true;
  }
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function run() {
  let written = 0;
  let skipped = 0;
  let before = 0;
  let after = 0;

  for (const root of ROOTS) {
    for await (const from of walk(join(SRC, root))) {
      const rel = relative(SRC, from);
      const { dir, name, ext } = parse(rel);
      const outDir = join(OUT, dir);

      if (/\.svg$/i.test(ext)) {
        await mkdir(outDir, { recursive: true });
        await copyFile(from, join(outDir, `${name}${ext}`));
        continue;
      }
      if (!RASTER.test(ext)) continue;

      const to = join(outDir, `${name}.webp`);
      if (!force && !(await newer(from, to))) {
        skipped++;
        continue;
      }

      const profile = profileFor(dir) ?? PROFILES[PROFILES.length - 1];
      await mkdir(outDir, { recursive: true });

      const info = await sharp(from)
        .rotate()
        .resize({
          width: profile.width,
          height: profile.height,
          fit: "inside",
          withoutEnlargement: true,
          kernel: "lanczos3",
        })
        .webp(profile.webp)
        .toFile(to);

      const size = (await stat(from)).size;
      before += size;
      after += info.size;
      written++;
      console.log(
        `  write  ${to.split(sep).join("/")}  ${info.width}×${info.height}  ` +
          `${Math.round(size / 1024)} KB → ${Math.round(info.size / 1024)} KB`,
      );
    }
  }

  /* App icons from the logo master: home-screen icons (PNG, which every
     platform accepts) and the Apple touch icon Next.js serves from app/. */
  const logoMaster = join(SRC, "brand", "bsm-logo.jpg");
  const icons = [
    [join(OUT, "brand", "icon-192.png"), 192],
    [join(OUT, "brand", "icon-512.png"), 512],
    [join("app", "apple-icon.png"), 180],
    /* The browser-tab icon. Next serves app/icon.png as the favicon. */
    [join("app", "icon.png"), 512],
  ];
  for (const [to, size] of icons) {
    if (!force && !(await newer(logoMaster, to))) continue;
    await sharp(logoMaster)
      .resize(size, size, { fit: "contain", background: "#04060a" })
      .png({ compressionLevel: 9 })
      .toFile(to);
    console.log(`  icon   ${to.split(sep).join("/")}  ${size}×${size}`);
  }

  if (written) {
    console.log(
      `\n${written} written, ${skipped} unchanged. ` +
        `${(before / 1048576).toFixed(1)} MB of masters → ${(after / 1048576).toFixed(1)} MB served.`,
    );
  } else {
    console.log(`Nothing to do — ${skipped} files already up to date.`);
  }
  console.log("Point an entry in lib/media at the new .webp file.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
