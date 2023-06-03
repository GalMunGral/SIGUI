import { Point } from "./utils.js";

export function bezier(controlPoints, t) {
  while (controlPoints.length > 1) {
    for (let i = 0; i < controlPoints.length - 1; ++i) {
      const { x: x1, y: y1 } = controlPoints[i];
      const { x: x2, y: y2 } = controlPoints[i + 1];
      controlPoints[i] = new Point(
        (1 - t) * x1 + t * x2,
        (1 - t) * y1 + t * y2
      );
    }
    controlPoints.length--;
  }
  return controlPoints[0];
}

// TODO: fix oversampling
export function sampleBezier(controlPoints, n = 10) {
  const res = [];
  for (let t = 0; t <= 1; t += 1 / n) {
    res.push(bezier([...controlPoints], t));
  }
  return res;
}
