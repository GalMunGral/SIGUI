import { Color, Point, setup } from "../modules/utils.js";
import { makeText } from "../modules/font.js";
import { simplePolygon } from "../modules/polygon.js";
import { bezier } from "../modules/bezier.js";

const canvas = document.querySelector("#animation");
const inputText = document.querySelector("#font-text");
const colorInput1 = document.querySelector("#animation-color-1");
const colorInput2 = document.querySelector("#animation-color-2");
const durationInput = document.querySelector("#animation-duration");
const clearButton = document.querySelector("#animation-clear");
const startButton = document.querySelector("#animation-start");

const S = 50;
const text = simplePolygon([
  new Point(-S, -S),
  new Point(S, -S),
  new Point(S, S),
  new Point(-S, S),
]);

const keyframes = [];
const controlPoints = [];
let start = Infinity;

startButton.onclick = () => {
  if (controlPoints.length >= 2) {
    start = Date.now();
  }
};

clearButton.onclick = () => {
  keyframes.length = 0;
  controlPoints.length = 0;
  start = Infinity;
};

setup(
  canvas,
  (buffer) => {
    const n = keyframes.length;
    const now = Date.now();

    if (start > now) {
      buffer.clear();
      return;
    }

    const duration = +durationInput.value;
    const t = ((now - start) / 1000) % duration;

    const dt = duration / n;
    const i = Math.floor(t / dt);
    // use quadratic bezier for interpolation
    const { x, y } = bezier(
      [keyframes[i], controlPoints[i], keyframes[(i + 1) % n]],
      (t % dt) / dt
    );

    const color1 = Color.parse(colorInput1.value);
    const color2 = Color.parse(colorInput2.value);
    const color = color1.interpolate(color2, t / duration);

    buffer.clear();
    text.translate(x, y).fill(buffer, () => color);
  },
  {
    onClick(p) {
      keyframes.push(p);
      if (controlPoints.length == 0) {
        controlPoints.push(p);
      } else {
        // reflection
        const cp = controlPoints[controlPoints.length - 1]
          .translate(-p.x, -p.y)
          .normalize()
          .scale(-300)
          .translate(p.x, p.y);

        controlPoints.push(cp);

        const first = keyframes[0];
        controlPoints[0] = cp
          .translate(-first.x, -first.y)
          .normalize()
          .scale(-300)
          .translate(first.x, first.y);
      }

      if (start < Date.now() && controlPoints.length >= 2) {
        start = Date.now();
      }
    },
  }
);
