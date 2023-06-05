import { Color, setup } from "../modules/utils.js";
import { simplePolygon } from "../modules/polygon.js";
import { sampleCircle } from "../modules/ellipse.js";
import { blur, getGaussianKernel1D } from "../modules/blur.js";
import { FontBook, makeText } from "../modules/font.js";
import { loadBitmap, sampleBitmap } from "../modules/bitmap.js";

const bitmap = await loadBitmap("monet.jpeg");
const padding = 120;

const canvas = document.querySelector("#glass");
const alphaInput = document.querySelector("#alpha");
const sigmaInput = document.querySelector("#sigma");

const font = FontBook.NotoSerif;
const text = "THE TAO OF ILLUSION";
const fontSize = 80;
const textWidth = font.getAdvanceWidth(text, fontSize);

let alpha = +alphaInput.value;
let kernel = getGaussianKernel1D(+sigmaInput.value);

const S = 40;
const circle = simplePolygon(sampleCircle(30)).scale(2 * S);
const glass = simplePolygon(sampleCircle(30)).scale(80);
let x = 0;
let y = 0;

let dirty = true;
let dragging = false;
let prev;

alphaInput.oninput = () => {
  alpha = +alphaInput.value;
  dirty = true;
};

sigmaInput.oninput = () => {
  kernel = getGaussianKernel1D(+sigmaInput.value);
  dirty = true;
};

setup(
  canvas,
  (buffer) => {
    if (dirty) {
      dirty = false;

      const red = new Color(1, 0, 0, alpha);
      const green = new Color(0, 1, 0, alpha);
      const blue = new Color(0, 0, 1, alpha);

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

      circle
        .translate(
          buffer.width / 2 + S,
          buffer.height / 2 + S * (Math.sqrt(3) / 3)
        )
        .fill(buffer, () => blue);

      circle
        .translate(
          buffer.width / 2 - S,
          buffer.height / 2 + S * (Math.sqrt(3) / 3)
        )
        .fill(buffer, () => green);

      circle
        .translate(
          buffer.width / 2,
          buffer.height / 2 - S * ((Math.sqrt(3) * 2) / 3)
        )
        .fill(buffer, () => red);

      makeText(
        text,
        buffer.width / 2 - textWidth / 2,
        buffer.height / 2 + fontSize / 4,
        fontSize,
        font
      ).fill(buffer, () => Color.WHITE);

      // frosted glass effect
      const gray = new Color(0.7, 0.7, 0.7, 0.3);
      glass.translate(x, y).fill(buffer, () => gray);
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
  }
);
