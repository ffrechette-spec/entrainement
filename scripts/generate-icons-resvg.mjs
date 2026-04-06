import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- background -->
  <rect width="512" height="512" rx="80" fill="#1a1a2e"/>
  <!-- G letterform using path: outer arc + inner cutout + crossbar -->
  <path
    d="
      M 256 96
      A 160 160 0 1 0 256 416
      A 160 160 0 0 0 416 280
      L 280 280
      L 280 336
      L 356 336
      A 108 108 0 1 1 256 148
      L 256 96 Z
    "
    fill="#FF6B9D"
  />
  <!-- crossbar fill -->
  <rect x="280" y="248" width="136" height="56" rx="6" fill="#FF6B9D"/>
</svg>`;

function render(size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  return Buffer.from(resvg.render().asPng());
}

const buf512 = render(512);
writeFileSync("public/icons/icon-512.png", buf512);
console.log(`✓ icon-512.png  — ${buf512.length} bytes`);

const buf192 = render(192);
writeFileSync("public/icons/icon-192.png", buf192);
console.log(`✓ icon-192.png  — ${buf192.length} bytes`);

const buf180 = render(180);
writeFileSync("public/icons/apple-touch-icon.png", buf180);
console.log(`✓ apple-touch-icon.png  — ${buf180.length} bytes`);
