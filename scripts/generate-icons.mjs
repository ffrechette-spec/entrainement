import sharp from "sharp";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

const BG = { r: 26, g: 26, b: 46, alpha: 1 };   // #1a1a2e

async function makeIcon(size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#1a1a2e" rx="${Math.round(size * 0.22)}"/>
    <text
      x="50%" y="54%"
      dominant-baseline="middle"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="${Math.round(size * 0.52)}"
      font-weight="bold"
      fill="#ffffff"
    >G</text>
  </svg>`;

  return sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toBuffer();
}

async function main() {
  const dir = "public/icons";
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  const icon192 = await makeIcon(192);
  await sharp(icon192).toFile(`${dir}/icon-192.png`);
  console.log("✓ icon-192.png");

  const icon512 = await makeIcon(512);
  await sharp(icon512).toFile(`${dir}/icon-512.png`);
  console.log("✓ icon-512.png");

  const apple = await makeIcon(180);
  await sharp(apple).toFile(`${dir}/apple-touch-icon.png`);
  console.log("✓ apple-touch-icon.png (180×180)");
}

main().catch((e) => { console.error(e); process.exit(1); });
