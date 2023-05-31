import { setup, scale, round } from "./utils.js";

const canvas = document.querySelector("#pixel");
const button = document.querySelector("#clear-pixel");
const { image, onMove } = setup(canvas);

export function clear(image) {
  image.data.fill(255);
}

export function putPixel(image, x, y, color) {
  const { data, width, height } = image;
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const [r, g, b, a] = round(scale(color, 255));
  data[(y * width + x) * 4] = r;
  data[(y * width + x) * 4 + 1] = g;
  data[(y * width + x) * 4 + 2] = b;
  data[(y * width + x) * 4 + 3] = a;
}

onMove((x, y) => {
  putPixel(image, x, y, [Math.random(), Math.random(), Math.random(), 1.0]);
});

button.onclick = () => {
  clear(image);
};
