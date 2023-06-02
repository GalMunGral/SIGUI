import { Color, setup } from "../modules/utils.js";
import { Edge, Polygon } from "../modules/polygon.js";

const canvas = document.querySelector("#polygon");
const button = document.querySelector("#polygon-clear");

const highlightColor = new Color(0.6, 0.0, 0.0);

const edges = [];
let firstVertex;
let lastVertex;
let pointerInside = false;
let dirty = false;

button.onclick = () => {
  edges.length = 0;
  firstVertex = lastVertex = null;
  dirty = true;
};

setup(
  canvas,
  (buffer) => {
    if (dirty) {
      dirty = false;
      const closedEdges = [...edges];
      if (lastVertex) {
        closedEdges.push(new Edge(firstVertex, lastVertex));
      }
      const polygon = new Polygon(closedEdges);
      buffer.clear();
      polygon.fill(buffer, () =>
        pointerInside ? highlightColor : Color.BLACK
      );
    }
  },
  {
    onClick(p) {
      if (lastVertex) {
        edges.push(new Edge(lastVertex, p));
        dirty = true;
      }
      if (!firstVertex) firstVertex = p;
      lastVertex = p;
    },

    onPointerMove(p) {
      if (edges.length == 0) return;
      const polygon = new Polygon([
        ...edges,
        new Edge(firstVertex, lastVertex),
      ]);
      if (polygon.contains(p) != pointerInside) {
        pointerInside = !pointerInside;
        dirty = true;
      }
    },
  }
);
