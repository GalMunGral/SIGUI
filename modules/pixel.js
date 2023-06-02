import { mult, add } from "./utils.js";

export function clear(image) {
  image.data.fill(255);
}

export function putPixel(image, x, y, color) {
  const { data, width, height } = image;
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const base = (y * width + x) * 4;
  const [r2, g2, b2, a2] = mult([...data.slice(base, base + 4)], 1 / 255);
  const [r1, g1, b1, a1] = color;
  const a = a1 + a2 * (1 - a1);
  const [r, g, b] = add(
    mult([r1, g1, b1], a1 / a),
    mult([r2, g2, b2], (a2 * (1 - a1)) / a)
  );
  data[base] = Math.round(r * 255);
  data[base + 1] = Math.round(g * 255);
  data[base + 2] = Math.round(b * 255);
  data[base + 3] = Math.round(a * 255);
}
