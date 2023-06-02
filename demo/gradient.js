import { fillPolygon, polygon } from "../modules/polygon.js";
import { setup, translate } from "../modules/utils.js";
import { clear } from "../modules/pixel.js";
import { linear, parseColor, radial } from "../modules/gradient.js";

const canvas = document.querySelector("#gradient");
const colorInput1 = document.querySelector("#gradient-color-1");
const colorInput2 = document.querySelector("#gradient-color-2");

const { image } = setup(canvas);

let c1 = [0.0, 0.0, 0.0, 1.0];
let c2 = [0.0, 0.0, 0.0, 1.0];

const S = 200;
const centerX = image.width / 2;
const centerY = image.height / 2;
const vertices = [
  [centerX - S, centerY - S],
  [centerX + S, centerY - S],
  [centerX + S, centerY + S],
  [centerX - S, centerY + S],
];
const edges1 = polygon(vertices.map(translate(-1.5 * S, 0)));
const edges2 = polygon(vertices.map(translate(1.5 * S, 0)));

function draw() {
  if (!edges1.length || !edges2.length) return;
  c1 = parseColor(colorInput1.value);
  c2 = parseColor(colorInput2.value);

  clear(image);

  const minY = edges1[0][0];
  const maxY = edges1[edges1.length - 1][1];

  fillPolygon(image, edges1, (_, y) => linear(y, minY, maxY, c1, c2));
  fillPolygon(image, edges2, (x, y) =>
    radial([x, y], [centerX + 1.5 * S, centerY], S, c1, c2)
  );
}

colorInput1.onchange = draw;
colorInput2.onchange = draw;

draw();
