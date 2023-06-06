import { Color, Vec2, setup } from "../modules/utils.js";
import { simplePolygon } from "../modules/polygon.js";
import { makeCurve } from "../modules/curve.js";

const canvas = document.querySelector("#curve");
const lineWidthInput = document.querySelector("#line-width");

const points = [];
let dirty = false;

lineWidthInput.oninput = () => {
  dirty = true;
};

setup(
  canvas,
  (buffer) => {
    if (dirty) {
      dirty = false;
      buffer.clear();
      makeCurve(points, +lineWidthInput.value / 2).fill(
        buffer,
        () => Color.BLACK
      );
    }
  },
  {
    onClick(p) {
      points.push(p);
      dirty = true;
    },
  }
);
