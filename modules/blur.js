import { Color } from "./utils.js";

const normalization = 1 / 273;
const kernelSize = 2;
const gaussianKernel = [
  [1, 4, 7, 4, 1],
  [4, 16, 26, 16, 4],
  [7, 26, 41, 26, 7],
  [4, 16, 26, 16, 4],
  [1, 4, 7, 4, 1],
];

export function blur(buffer, polygon) {
  const pixels = buffer.pixels.slice();
  function get(x, y) {
    if (x < 0 || x >= buffer.width || y < 0 || y >= buffer.height) {
      return Color.TRANSPARENT;
    }
    return pixels[y * buffer.width + x];
  }
  polygon.fill(buffer, (x, y) => {
    let color = Color.TRANSPARENT;
    for (let i = -kernelSize; i <= kernelSize; ++i) {
      for (let j = -kernelSize; j <= kernelSize; ++j) {
        color = color.add(
          get(x + i, y + j).scale(
            gaussianKernel[kernelSize + i][kernelSize + j]
          )
        );
      }
    }
    return color.scale(normalization);
  });
}
