/**
 * Builds a multi-size favicon.ico from the site's square icon.
 *
 * Sizes: 16 and 32 for browser tabs and bookmarks, 48 because Google's
 * favicon crawler documents a square that is a multiple of 48px.
 *
 * The container is the PNG-in-ICO form every browser since IE11 reads, so
 * each entry is simply the encoded PNG with a 16-byte directory record.
 *
 * Each frame is written as 8-bit RGBA, not as a palette or a plain RGB:
 * Next.js reads the finished file to work out what to put in the <link>,
 * and its decoder rejects anything else with "The PNG is not in RGBA
 * format!" — which fails the build rather than the icon.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const [src, dest] = process.argv.slice(2);
const SIZES = [16, 32, 48];

const images = await Promise.all(
  SIZES.map((size) =>
    sharp(src)
      .resize(size, size, { fit: "cover" })
      .ensureAlpha()
      .png({ compressionLevel: 9, palette: false, colours: 256 })
      .toColourspace("srgb")
      .toBuffer(),
  ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(SIZES.length, 4);

const directory = Buffer.alloc(16 * SIZES.length);
let offset = header.length + directory.length;

SIZES.forEach((size, i) => {
  const at = i * 16;
  directory.writeUInt8(size === 256 ? 0 : size, at);
  directory.writeUInt8(size === 256 ? 0 : size, at + 1);
  directory.writeUInt8(0, at + 2); // palette size: none
  directory.writeUInt8(0, at + 3); // reserved
  directory.writeUInt16LE(1, at + 4); // colour planes
  directory.writeUInt16LE(32, at + 6); // bits per pixel
  directory.writeUInt32LE(images[i].length, at + 8);
  directory.writeUInt32LE(offset, at + 12);
  offset += images[i].length;
});

await writeFile(dest, Buffer.concat([header, directory, ...images]));
console.log(`${dest}: ${SIZES.join(", ")} px, ${offset} bytes`);
