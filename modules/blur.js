import { Color } from "./utils.js";

const gaussianKernel1D = [
  0.00147945, 0.00380424, 0.00875346, 0.01802341, 0.03320773, 0.05475029,
  0.08077532, 0.106639, 0.12597909, 0.133176, 0.12597909, 0.106639, 0.08077532,
  0.05475029, 0.03320773, 0.01802341, 0.00875346, 0.00380424, 0.00147945,
];

const k = gaussianKernel1D.length >> 1;

export function blur(buffer, polygon) {
  const { width, height, pixels } = buffer;

  const convolution1D = pixels.slice();

  polygon.traverse((x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    let color = Color.TRANSPARENT;
    for (let i = -k; i <= k; ++i) {
      if (x + i >= 0 && x + i < width) {
        color = color.add(
          pixels[y * width + (x + i)].scale(gaussianKernel1D[k + i])
        );
      }
    }
    convolution1D[y * width + x] = color;
  });

  polygon.traverse((x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    let color = Color.TRANSPARENT;
    for (let i = -k; i <= k; ++i) {
      if (y + i >= 0 && y + i < height) {
        color = color.add(
          convolution1D[(y + i) * width + x].scale(gaussianKernel1D[k + i])
        );
      }
    }
    buffer.putPixel(x, y, color);
  });
}
