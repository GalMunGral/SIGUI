import { setup, scale, round } from "./utils.js";
import { fillPolygon } from "./polygon.js";
import { clear } from "./pixel.js";
const canvas1 = document.querySelector("#quadratic-bezier");
const canvas2 = document.querySelector("#cubic-bezier");
const button1 = document.querySelector("#clear-quadratic-bezier");
const button2 = document.querySelector("#clear-cubic-bezier");
const c1 = setup(canvas1);
const c2 = setup(canvas2);

export function bezier(controlPoints) {
  const vertices = [];
  for (let t = 0; t <= 1; t += 1 / 64) {
    const points = [...controlPoints];
    while (points.length > 1) {
      for (let i = 0; i < points.length - 1; ++i) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];
        points[i] = [(1 - t) * x1 + t * x2, (1 - t) * y1 + t * y2];
      }
      points.length--;
    }
    vertices.push(points[0]);
  }
  return vertices;
}

function fillBezier(image, controlPoints, order, color) {
  const vertices = [];
  for (let i = 0; i < controlPoints.length; i += order) {
    if (controlPoints.length - i > order) {
      vertices.push(...bezier(controlPoints.slice(i, i + order + 1)));
    } else {
      // vertices.push(
      //   ...bezier([controlPoints[i], ...Array(order).fill(controlPoints[0])])
      // );
    }
  }
  clear(image);
  fillPolygon(image, vertices, color);
}

const controlPoints1 = [];
const controlPoints2 = [];

c1.onClick((x, y) => {
  controlPoints1.push([x, y]);
  clear(c1.image);
  fillBezier(c1.image, controlPoints1, 2, () => [0.0, 0.0, 0.0, 1.0]);
});

c2.onClick((x, y) => {
  controlPoints2.push([x, y]);
  clear(c2.image);
  fillBezier(c2.image, controlPoints2, 3, () => [0.0, 0.0, 0.0, 1.0]);
});

button1.onclick = () => {
  controlPoints1.length = 0;
  clear(c1.image);
};

button2.onclick = () => {
  controlPoints2.length = 0;
  clear(c2.image);
};
