import { parse } from "https://unpkg.com/opentype.js/dist/opentype.module.js";
import { makeBezier } from "./bezier.js";
import { fillPolygon, polygon } from "./polygon.js";

const data = await (await fetch("./Times.ttf")).arrayBuffer();

export const font = parse(data);

export function makeText(text, dx, dy, size) {
  const edges = [];
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
            ...makeBezier([x, y], [cmd.x1, cmd.y1], [cmd.x, cmd.y])
          );
          x = cmd.x;
          y = cmd.y;
          break;
        case "C":
          vertices.push(
            ...makeBezier(
              [x, y],
              [cmd.x1, cmd.y1],
              [cmd.x2, cmd.y2],
              [cmd.x, cmd.y]
            )
          );
          x = cmd.x;
          y = cmd.y;
          break;
        case "Z":
          break;
      }
    }
    res.push(vertices);
    vertices = [];
  }
  return res;
}

export function drawText(image, text, dx, dy, size, color) {
  for (const vertices of makeText(text, dx, dy, size)) {
    fillPolygon(image, polygon(vertices), color);
  }
}
