import { Color, setup } from "../modules/utils.js";
import { makeText } from "../modules/font.js";

const canvas = document.querySelector("#animation");
const inputText = document.querySelector("#font-text");
const colorInput1 = document.querySelector("#animation-color-1");
const colorInput2 = document.querySelector("#animation-color-2");
const durationInput = document.querySelector("#animation-duration");
const clearButton = document.querySelector("#animation-clear");
const startButton = document.querySelector("#animation-start");

const fontSize = 60;
const text = makeText(inputText.value, 0, fontSize);

const controlPoints = [];
let start = Infinity;

startButton.onclick = () => {
  if (controlPoints.length >= 2) {
    start = Date.now();
  }
};

clearButton.onclick = () => {
  controlPoints.length = 0;
  start = Infinity;
};

setup(
  canvas,
  (buffer) => {
    const n = controlPoints.length;
    const now = Date.now();

    if (start > now) {
      buffer.clear();
      return;
    }

    const duration = +durationInput.value;
    const t = ((now - start) / 1000) % duration;

    const dt = duration / (n - 1);
    const i = Math.floor(t / dt);
    const { x, y } = controlPoints[i].interpolate(
      controlPoints[i + 1],
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
      controlPoints.push(p);
      if (start < Date.now() && controlPoints.length >= 2) {
        start = Date.now();
      }
    },
  }
);
