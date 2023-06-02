import { black, setup } from "../modules/utils.js";
import { clear } from "../modules/pixel.js";
import { Polygon } from "../modules/polygon.js";

const canvas = document.querySelector("#polygon");
const button = document.querySelector("#polygon-clear");

const highlightColor = [0.6, 0.0, 0.0, 1, 0];

let polygon = new Polygon([]);
let firstVertex;
let lastVertex;
let pointerInside = false;
let dirty = false;

button.onclick = () => {
  polygon = new Polygon([]);
  firstVertex = lastVertex = null;
  dirty = true;
};

setup(
  canvas,
  (buffer) => {
    if (dirty) {
      dirty = false;
      clear(buffer);
      polygon
        .addEdge(firstVertex, lastVertex)
        .fill(buffer, () => (pointerInside ? highlightColor : black));
    }
  },
  {
    onClick(p) {
      if (lastVertex) {
        polygon = polygon.addEdge(lastVertex, p);
        dirty = true;
      }
      if (!firstVertex) firstVertex = p;
      lastVertex = p;
    },

    onPointerMove(p) {
      if (
        polygon.addEdge(firstVertex, lastVertex).contains(p) != pointerInside
      ) {
        pointerInside = !pointerInside;
        dirty = true;
      }
    },
  }
);
