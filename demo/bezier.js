import { setup } from "../modules/utils.js";
import { fillPolygon, polygon } from "../modules/polygon.js";
import { clear } from "../modules/pixel.js";
import { makeBezier } from "../modules/bezier.js";

const canvas1 = document.querySelector("#quadratic-bezier");
const canvas2 = document.querySelector("#cubic-bezier");
const button1 = document.querySelector("#clear-quadratic-bezier");
const button2 = document.querySelector("#clear-cubic-bezier");
const c1 = setup(canvas1);
const c2 = setup(canvas2);

function fillBezier(image, controlPoints, order, color) {
  const vertices = [];
  for (let i = 0; i < controlPoints.length; i += order) {
    if (controlPoints.length - i > order) {
      vertices.push(...makeBezier(...controlPoints.slice(i, i + order + 1)));
    } else {
      // vertices.push(
      //   ...makeBezier([controlPoints[i], ...Array(order).fill(controlPoints[0])])
      // );
    }
  }
  const outline = polygon(vertices);
  clear(image);
  fillPolygon(image, outline, color);
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
