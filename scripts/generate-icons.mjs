import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

// SVG sans <text> — sharp ne rend pas les polices système.
// Le "G" est construit en formes géométriques pures.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#1a1a2e"/>
  <rect x="100" y="130" width="60" height="252" rx="8" fill="#FF6B9D"/>
  <rect x="100" y="130" width="220" height="60" rx="8" fill="#FF6B9D"/>
  <rect x="100" y="322" width="220" height="60" rx="8" fill="#FF6B9D"/>
  <rect x="260" y="256" width="60" height="126" rx="8" fill="#FF6B9D"/>
  <rect x="200" y="256" width="120" height="50" rx="6" fill="#FF6B9D"/>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf, { density: 144 }).resize(512, 512).png().toFile("public/icons/icon-512.png");
console.log("✓ icon-512.png (512×512)");

await sharp(buf, { density: 144 }).resize(192, 192).png().toFile("public/icons/icon-192.png");
console.log("✓ icon-192.png (192×192)");

await sharp(buf, { density: 144 }).resize(180, 180).png().toFile("public/icons/apple-touch-icon.png");
console.log("✓ apple-touch-icon.png (180×180)");
