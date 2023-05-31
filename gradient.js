import { fillPolygon } from "./polygon.js";
import { add, dist, scale, setup } from "./utils.js";
import { clear } from "./pixel.js";

const canvas1 = document.querySelector("#linear-gradient");
const canvas2 = document.querySelector("#radial-gradient");
const colorInput1 = document.querySelector("#linear-gradient-color-1");
const colorInput2 = document.querySelector("#linear-gradient-color-2");
const button1 = document.querySelector("#clear-linear-gradient");
const colorInput3 = document.querySelector("#radial-gradient-color-1");
const colorInput4 = document.querySelector("#radial-gradient-color-2");
const button2 = document.querySelector("#clear-radial-gradient");

const c1 = setup(canvas1);
const c2 = setup(canvas2);

function parseColor(s) {
  const r = parseInt(s.slice(1, 3), 16) / 255;
  const g = parseInt(s.slice(3, 5), 16) / 255;
  const b = parseInt(s.slice(5, 7), 16) / 255;
  return [r, g, b, 1.0];
}

let linearColor1 = [0.0, 0.0, 0.0, 1.0];
let linearColor2 = [0.0, 0.0, 0.0, 1.0];
let radialColor1 = [0.0, 0.0, 0.0, 1.0];
let radialColor2 = [0.0, 0.0, 0.0, 1.0];

const vertices1 = [];
const vertices2 = [];

function interpolate(value1, value2, t) {
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
  const [minX, minY, maxX, maxY] = boundingBox(vertices1);
  clear(c1.image);
  fillPolygon(c1.image, vertices1, (x, y) => {
    return linearGradient(y, minY, maxY, linearColor1, linearColor2);
  });
}

function draw2() {
  const [minX, minY, maxX, maxY] = boundingBox(vertices2);
  const center = [(minX + maxX) / 2, (minY + maxY) / 2];
  const maxRadius = 0.7 * dist(center, [minX, minY]);
  clear(c2.image);
  fillPolygon(c2.image, vertices2, (x, y) => {
    return radialGradient(
      [x, y],
      center,
      maxRadius,
      radialColor1,
      radialColor2
    );
  });
}

colorInput1.onchange = (e) => {
  linearColor1 = parseColor(e.target.value);
  draw1();
};
colorInput2.onchange = (e) => {
  linearColor2 = parseColor(e.target.value);
  draw1();
};
colorInput3.onchange = (e) => {
  radialColor1 = parseColor(e.target.value);
  draw2();
};
colorInput4.onchange = (e) => {
  radialColor2 = parseColor(e.target.value);
  draw2();
};

c1.onClick((x, y) => {
  vertices1.push([x, y]);
  draw1();
});

c2.onClick((x, y) => {
  vertices2.push([x, y]);
  draw2();
});

button1.onclick = () => {
  vertices1.length = 0;
  clear(c1.image);
};

button2.onclick = () => {
  vertices2.length = 0;
  clear(c2.image);
};
