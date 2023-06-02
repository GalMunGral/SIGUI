export function makeBezier(...controlPoints) {
  const vertices = [];
  for (let t = 0; t <= 1; t += 1 / 64) {
    const points = [...controlPoints];
    while (points.length > 1) {
      for (let i = 0; i < points.length - 1; ++i) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];
        points[i] = [(1 - t) * x1 + t * x2, (1 - t) * y1 + t * y2];
      }
      points.length--;
    }
    vertices.push(points[0]);
  }
  return vertices;
}
