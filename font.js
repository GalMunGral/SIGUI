import { parse } from "https://unpkg.com/opentype.js/dist/opentype.module.js";
import { bezier } from "./bezier.js";
import { fillPolygon } from "./polygon.js";
import { setup } from "./utils.js";
import { clear } from "./pixel.js";

const data = await (await fetch("/Times.ttf")).arrayBuffer();
const font = parse(data);

const canvas = document.querySelector("#font");
const inputSize = document.querySelector("#font-size");
const inputText = document.querySelector("#font-text");
const button = document.querySelector("#clear-font");
const { image, onDrag } = setup(canvas);

export function drawText(image, text, dx, dy, size, color) {
  const vertices = [];
  let x, y;

  for (const path of font.getPaths(text, dx, dy, size)) {
    for (const cmd of path.commands) {
      switch (cmd.type) {
        case "M":
          x = cmd.x;
          y = cmd.y;
          break;
        case "L":
          vertices.push([x, y], [cmd.x, cmd.y]);
          x = cmd.x;
          y = cmd.y;
          break;
        case "Q":
          vertices.push(
            ...bezier([
              [x, y],
              [cmd.x1, cmd.y1],
              [cmd.x, cmd.y],
            ])
          );
          x = cmd.x;
          y = cmd.y;
          break;
        case "C":
          vertices.push(
            ...bezier([
              [x, y],
              [cmd.x1, cmd.y1],
              [cmd.x2, cmd.y2],
              [cmd.x, cmd.y],
            ])
          );
          x = cmd.x;
          y = cmd.y;
          break;
        case "Z":
          // TODO: verify this step - noop
          break;
      }
    }
    fillPolygon(image, vertices, color);
    vertices.length = 0;
  }
}

let x = 0;
let y = +inputSize.value;

function draw() {
  const fontSize = +inputSize.value || 0;
  clear(image);
  drawText(image, inputText.value, x, y, fontSize, () => [0.0, 0.0, 0.0, 1.0]);
}

onDrag((dx, dy) => {
  x += dx;
  y += dy;
  draw();
});

button.onclick = () => {
  draw();
};
