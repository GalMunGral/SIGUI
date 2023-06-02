import { setup, translate } from "../modules/utils.js";
import { fillPolygon, polygon } from "../modules/polygon.js";
import { clear } from "../modules/pixel.js";
import { interpolate, parseColor } from "../modules/gradient.js";
import { makeText } from "../modules/font.js";

const canvas = document.querySelector("#animation");
const inputText = document.querySelector("#font-text");
const colorInput1 = document.querySelector("#animation-color-1");
const colorInput2 = document.querySelector("#animation-color-2");
const durationInput = document.querySelector("#animation-duration");
const clearButton = document.querySelector("#animation-clear");
const startButton = document.querySelector("#animation-start");

const { image, onClick } = setup(canvas);

const fontSize = 60;
const textVertices = makeText(inputText.value, 0, fontSize);

const controlPoints = [];
let start = 0;
let handle;

function draw() {
  const n = controlPoints.length;
  if (n < 2) return;
  const duration = +durationInput.value;
  const color1 = parseColor(colorInput1.value);
  const color2 = parseColor(colorInput2.value);

  const t = ((Date.now() - start) / 1000) % duration;
  const dt = duration / (n - 1);
  const i = Math.floor(t / dt);
  const [x, y] = interpolate(
    controlPoints[i],
    controlPoints[i + 1],
    (t % dt) / dt
  );
  const color = interpolate(color1, color2, t / duration);

  clear(image);
  for (const vertices of textVertices) {
    fillPolygon(
      image,
      polygon(vertices.map((p) => translate(x, y)(p))),
      () => color
    );
  }

  handle = requestAnimationFrame(draw);
}

onClick((x, y) => {
  controlPoints.push([x, y]);
});

startButton.onclick = () => {
  cancelAnimationFrame(handle);
  start = Date.now();
  handle = requestAnimationFrame(draw);
};

clearButton.onclick = () => {
  cancelAnimationFrame(handle);
  controlPoints.length = 0;
  clear(image);
};
