import { Point } from "./utils.js";

export function sampleEllipticArc(n, a, b, phi1, phi2) {
  const res = [];
  for (let i = 0; i <= n; ++i) {
    res.push(
      new Point(
        a * Math.cos(phi1 + (i * (phi2 - phi1)) / n),
        b * Math.sin(phi1 + (i * (phi2 - phi1)) / n)
      )
    );
  }
  return res;
}
