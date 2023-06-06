import { Color, setup } from "../modules/utils.js";
import { simplePolygon } from "../modules/polygon.js";
import { makeRing, sampleCircle } from "../modules/ellipse.js";
import { blur, getGaussianKernel1D } from "../modules/blur.js";
// import { FontBook, makeText } from "../modules/font.js";
import { loadBitmap, sampleBitmap } from "../modules/bitmap.js";

const bitmap = await loadBitmap("monet.jpeg");
const padding = 0;

const canvas = document.querySelector("#glass");
const sigmaInput = document.querySelector("#sigma");

// const font = FontBook.NotoSerif;
// const text = "THE TAO OF ILLUSION";
// const fontSize = 80;
// const textWidth = font.getAdvanceWidth(text, fontSize);

let kernel = getGaussianKernel1D(+sigmaInput.value);

const lensSize = 80;
const frameSize = 10;
const glass = simplePolygon(sampleCircle(30)).scale(lensSize);
const outline = makeRing(lensSize, lensSize + frameSize);

let x = 0;
let y = 0;

let dirty = true;
let dragging = false;
let prev;

sigmaInput.oninput = () => {
  kernel = getGaussianKernel1D(+sigmaInput.value);
  dirty = true;
};

setup(
  canvas,
  (buffer) => {
    if (dirty) {
      dirty = false;

      buffer.clear();

      for (let x = padding; x < buffer.width - padding; ++x) {
        for (let y = padding; y < buffer.height - padding; ++y) {
          buffer.putPixel(
            x,
            y,
            sampleBitmap(
              bitmap,
              (x - padding) / (buffer.width - 2 * padding),
              (y - padding) / (buffer.height - 2 * padding)
            )
          );
        }
      }

      // makeText(
      //   text,
      //   buffer.width / 2 - textWidth / 2,
      //   buffer.height / 2 + fontSize / 4,
      //   fontSize,
      //   font
      // ).fill(buffer, () => Color.WHITE);

      // frosted glass effect
      // const lensColor = new Color(0.7, 0.7, 0.7, 0.3);
      const frameColor = new Color(0.9, 0.9, 0.9, 1);
      outline.translate(x, y).fill(buffer, () => frameColor);
      // glass.translate(x, y).fill(buffer, () => lensColor);
      blur(buffer, glass.translate(x, y), kernel);
    }
  },
  {
    onPointerDown(p) {
      if (glass.translate(x, y).contains(p)) {
        dragging = true;
        prev = p;
      }
    },
    onPointerUp() {
      dragging = false;
    },
    onPointerMove(p) {
      if (dragging) {
        x += p.x - prev.x;
        y += p.y - prev.y;
        prev = p;
        dirty = true;
      }
    },
  },
  1
);
