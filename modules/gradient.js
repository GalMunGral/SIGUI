import { add, dist, mult } from "./utils.js";

export function parseColor(s) {
  const r = parseInt(s.slice(1, 3), 16) / 255;
  const g = parseInt(s.slice(3, 5), 16) / 255;
  const b = parseInt(s.slice(5, 7), 16) / 255;
  return [r, g, b, 1.0];
}

export function interpolate(value1, value2, t) {
  return add(mult(value1, 1 - t), mult(value2, t));
}

export function linear(y, minY, maxY, color1, color2) {
  return interpolate(color1, color2, (y - minY) / (maxY - minY));
}

export function radial(p, center, maxRadius, color1, color2) {
  return interpolate(color1, color2, Math.min(1, dist(p, center) / maxRadius));
}
