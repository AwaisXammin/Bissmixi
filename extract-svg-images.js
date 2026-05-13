/**
 * One-time helper: extract all base64 PNG images embedded in the
 * Figma SVG export and save them to assets/images/extracted/.
 * Run: node extract-svg-images.js <path-to-svg>
 */
import fs from "node:fs";
import path from "node:path";

const svgPath = process.argv[2];
if (!svgPath) {
  console.error("usage: node extract-svg-images.js <path-to-svg>");
  process.exit(1);
}

const outDir = path.resolve("assets/images/extracted");
fs.mkdirSync(outDir, { recursive: true });

console.log("Reading SVG…");
const svg = fs.readFileSync(svgPath, "utf8");

const re =
  /<image[^>]*\bid="([^"]+)"[^>]*\bwidth="(\d+)"[^>]*\bheight="(\d+)"[^>]*xlink:href="data:image\/png;base64,([^"]+)"/g;

let m,
  count = 0;
while ((m = re.exec(svg))) {
  const [, id, w, h, b64] = m;
  const buf = Buffer.from(b64, "base64");
  const fname = `${id}__${w}x${h}.png`;
  fs.writeFileSync(path.join(outDir, fname), buf);
  console.log(`saved ${fname}  (${(buf.length / 1024).toFixed(0)} KB)`);
  count++;
}

console.log(`\nDone — extracted ${count} images to ${outDir}`);
