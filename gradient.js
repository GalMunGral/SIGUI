import { fillPolygon } from "./polygon.js";
import { add, dist, scale, setup } from "./utils.js";
import { clear } from "./pixel.js";
import { vertices } from "./ellipse.js";

const canvas1 = document.querySelector("#linear-gradient");
const canvas2 = document.querySelector("#radial-gradient");
const colorInput1 = document.querySelector("#linear-gradient-color-1");
const colorInput2 = document.querySelector("#linear-gradient-color-2");
const colorInput3 = document.querySelector("#radial-gradient-color-1");
const colorInput4 = document.querySelector("#radial-gradient-color-2");

const c1 = setup(canvas1);
const c2 = setup(canvas2);

export function parseColor(s) {
  const r = parseInt(s.slice(1, 3), 16) / 255;
  const g = parseInt(s.slice(3, 5), 16) / 255;
  const b = parseInt(s.slice(5, 7), 16) / 255;
  return [r, g, b, 1.0];
}

let linearColor1 = [0.0, 0.0, 0.0, 1.0];
let linearColor2 = [0.0, 0.0, 0.0, 1.0];
let radialColor1 = [0.0, 0.0, 0.0, 1.0];
let radialColor2 = [0.0, 0.0, 0.0, 1.0];

export function interpolate(value1, value2, t) {
  return add(scale(value1, 1 - t), scale(value2, t));
}

function linearGradient(y, minY, maxY, color1, color2) {
  return interpolate(color1, color2, (y - minY) / (maxY - minY));
}

function radialGradient(p, center, maxRadius, color1, color2) {
  return interpolate(color1, color2, Math.min(1, dist(p, center) / maxRadius));
}

function boundingBox(vertices) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of vertices) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return [minX, minY, maxX, maxY];
}

function draw1() {
  linearColor1 = parseColor(colorInput1.value);
  linearColor2 = parseColor(colorInput2.value);
  const [minX, minY, maxX, maxY] = boundingBox(vertices);
  clear(c1.image);
  fillPolygon(c1.image, vertices, (x, y) => {
    return linearGradient(y, minY, maxY, linearColor1, linearColor2);
  });
}

function draw2() {
  radialColor1 = parseColor(colorInput3.value);
  radialColor2 = parseColor(colorInput4.value);
  const [minX, minY, maxX, maxY] = boundingBox(vertices);
  // const center = [(maxX + minX) / 2, (maxY + minY) / 2];
  // const maxRadius = dist([minX, minY], center);
  const center = [minX, minY];
  const maxRadius = Math.min(maxX - minX, maxY - minY);
  clear(c2.image);
  fillPolygon(c2.image, vertices, (x, y) => {
    return radialGradient(
      [x, y],
      center,
      maxRadius,
      radialColor1,
      radialColor2
    );
  });
}

colorInput1.onchange = draw1;
colorInput2.onchange = draw1;
colorInput3.onchange = draw2;
colorInput4.onchange = draw2;

draw1();
draw2();
