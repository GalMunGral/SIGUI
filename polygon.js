import { setup } from "./utils.js";
import { clear, putPixel } from "./pixel.js";

const canvas = document.querySelector("#polygon");
const button = document.querySelector("#polygon-clear");
const { image, onClick, onMove } = setup(canvas);

export function fillPolygon(image, vertices, color) {
  const edges = [];

  for (const i of vertices.keys()) {
    let [x1, y1] = vertices[i];
    let [x2, y2] = vertices[(i + 1) % vertices.length];
    if (y1 > y2) [x1, x2, y1, y2] = [x2, x1, y2, y1];
    if (Math.ceil(y1) >= y2) continue; // TODO: verify this...
    // [min-y, max-y, min-x, dx/dy]
    edges.push([y1, y2, x1, (x2 - x1) / (y2 - y1)]);
  }

  if (!edges.length) return;

  // sort primarily by min-y, secondarily by min-x
  edges.sort((e1, e2) => (e1[0] == e2[0] ? e1[2] - e2[2] : e1[0] - e2[0]));

  // scan-line fill
  let y = Math.ceil(edges[0][0]) - 1;
  let active = [];

  do {
    for (let i = 0; i < active.length; i += 2) {
      for (let x = Math.ceil(active[i][1]); x < active[i + 1][1]; ++x) {
        putPixel(image, x, y, color(x, y));
      }
    }

    ++y;
    active = active.filter(([minY]) => minY > y);
    for (const edge of active) {
      edge[1] += edge[2];
    }
    while (edges.length && edges[0][0] <= y) {
      const [minY, maxY, minX, k] = edges.shift();
      // [max-y, intersection-x, k]
      active.push([maxY, minX + k * (y - minY), k]);
    }
    // sort by intersection-x
    active.sort((e1, e2) => e1[1] - e2[1]);
  } while (active.length || edges.length);
}

export function hitTest([x, y], vertices) {
  let intersections = 0;
  for (const i of vertices.keys()) {
    let [x1, y1] = vertices[i];
    let [x2, y2] = vertices[(i + 1) % vertices.length];
    if (y1 > y2) [x1, x2, y1, y2] = [x2, x1, y2, y1];
    if (y1 <= y && y2 > y) {
      const intersectionX = x1 + ((x2 - x1) / (y2 - y1)) * (y - y1);
      if (intersectionX > x) {
        ++intersections;
      }
    }
  }
  return intersections & 1;
}

let inside = false;
const vertices = [];

function draw() {
  clear(image);
  fillPolygon(image, vertices, () =>
    inside ? [0.6, 0.0, 0.0, 1, 0] : [0.0, 0.0, 0.0, 1.0]
  );
}

onClick((x, y) => {
  vertices.push([x, y]);
  draw();
});

onMove((x, y) => {
  if (hitTest([x, y], vertices) != inside) {
    inside = !inside;
    draw();
  }
});

button.onclick = () => {
  vertices.length = 0;
  draw();
};
