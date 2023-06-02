import { putPixel } from "../modules/pixel.js";
import { setup } from "../modules/utils.js";

const canvas = document.querySelector("#pixel");
const button = document.querySelector("#clear-pixel");
const { image, onMove } = setup(canvas);

onMove((x, y) => {
  putPixel(image, x, y, [Math.random(), Math.random(), Math.random(), 1.0]);
});

button.onclick = () => {
  clear(image);
};
