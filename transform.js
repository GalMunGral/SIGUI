import { setup } from "./utils.js";
import { clear } from "./pixel.js";
import { fillPolygon } from "./polygon.js";

const { sin, cos } = Math;

const canvas = document.querySelector("#transform");
const { image, onDrag } = setup(canvas);

const translate =
  (dx, dy) =>
  ([x, y]) =>
    [x + dx, y + dy];

const scale =
  (c) =>
  ([x, y]) =>
    [x * c, y * c];

const rotate =
  (t) =>
  ([x, y]) =>
    [x * cos(t) - y * sin(t), x * sin(t) + y * cos(t)];

const compose =
  (...transforms) =>
  (p) =>
    transforms.reduceRight((p, t) => t(p), p);

export { translate, scale, rotate, compose };

const S = 50;
const vertices = [
  [-S, -S],
  [S, -S],
  [S, S],
  [-S, S],
];

let x = image.width / 2;
let y = image.height / 2;
let s = 1;
let t = 0;
let dirty = false;

onDrag((dx, dy) => {
  dirty = true;
  x += dx;
  y += dy;
  t += 0.05;
  s = 1 + 0.5 * Math.sin(t);
});

requestAnimationFrame(function draw() {
  if (dirty) {
    dirty = false;
    clear(image);
    fillPolygon(
      image,
      vertices.map((p) => compose(translate(x, y), scale(s), rotate(t))(p)),
      () => [0.0, 0.0, 0.0, 1.0]
    );
  }
  requestAnimationFrame(draw);
});

fillPolygon(
  image,
  vertices.map((p) => compose(translate(x, y), scale(s), rotate(t))(p)),
  () => [0.0, 0.0, 0.0, 1.0]
);
