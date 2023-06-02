import { Polygon } from "./polygon.js";
import { Point } from "./utils.js";

export function makeEllipse(n, a, b, cx, cy, theta, phi1, phi2) {
  const center = new Point(0, 0);

  let polygon = new Polygon();
  let prev = center;

  for (let i = 0; i <= n; ++i) {
    const p = new Point(
      a * Math.cos(phi1 + (i * (phi2 - phi1)) / n),
      b * Math.sin(phi1 + (i * (phi2 - phi1)) / n)
    );
    polygon = polygon.addEdge(prev, p);
    prev = p;
  }

  return polygon.addEdge(prev, center).rotate(theta).translate(cx, cy);
}
