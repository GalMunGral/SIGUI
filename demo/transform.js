import { clear } from "../modules/pixel.js";
import { Point, setup } from "../modules/utils.js";
import { Edge, Polygon } from "../modules/polygon.js";

const canvas = document.querySelector("#transform");

const S = 50;
const p1 = new Point(-S, -S);
const p2 = new Point(S, -S);
const p3 = new Point(S, S);
const p4 = new Point(-S, S);
const square = new Polygon()
  .addEdge(p1, p2)
  .addEdge(p2, p3)
  .addEdge(p3, p4)
  .addEdge(p4, p1);

let dx = 100;
let dy = 100;
let s = 1;
let t = 0;
let dragging = false;
let prevPoint;

let initial = true;
setup(
  canvas,
  (buffer) => {
    const boundary = square.rotate(t).scale(s).translate(dx, dy);
    if (initial) {
      initial = false;
      boundary.fill(buffer, () => [0.0, 0.0, 0.0, 1.0]);
    }
    if (dragging) {
      clear(buffer);
      boundary.fill(buffer, () => [0.0, 0.0, 0.0, 1.0]);
    }
  },
  {
    onPointerMove(p) {
      if (dragging) {
        dx += p.x - prevPoint.x;
        dy += p.y - prevPoint.y;
        prevPoint = p;
        t += 0.1;
        s = 1 + 0.5 * Math.sin(t);
      }
    },
    onPointerDown(p) {
      const boundary = square.rotate(t).scale(s).translate(dx, dy);
      if (boundary.contains(p)) {
        dragging = true;
        prevPoint = p;
      }
    },
    onPointerUp() {
      dragging = false;
    },
  }
);
