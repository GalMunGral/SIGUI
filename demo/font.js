import { setup } from "../modules/utils.js";
import { clear } from "../modules/pixel.js";
import { drawText, font } from "../modules/font.js";

const canvas = document.querySelector("#font");
const inputSize = document.querySelector("#font-size");
const inputText = document.querySelector("#font-text");
const { image, onDrag } = setup(canvas);

let x = 0;
let y = +inputSize.value;
let dirty = true;

requestAnimationFrame(function draw() {
  if (dirty) {
    dirty = false;
    const fontSize = +inputSize.value || 0;

    clear(image);
    drawText(image, inputText.value, x, y, fontSize, () => [
      0.0, 0.0, 0.0, 1.0,
    ]);
  }
  requestAnimationFrame(draw);
});

onDrag((dx, dy) => {
  x += dx;
  y += dy;
  dirty = true;
});

inputSize.oninput = () => {
  dirty = true;
};

inputText.oninput = () => {
  dirty = true;
};
