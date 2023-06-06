import { Color, Vec2, setup } from "../modules/utils.js";

const canvas = document.querySelector("#raster");
const textDisplay = document.querySelector("#pointer-xy");

let rendered = false;
let pointer = new Vec2(0, 0);
setup(
  canvas,
  (buffer, now) => {
    textDisplay.textContent = `t=${(now / 1000).toFixed(
      3
    )} x=${pointer.x.toFixed(3)}, y=${pointer.y.toFixed(3)}`;
    if (!rendered) {
      rendered = true;
      for (let x = 0; x < buffer.width; ++x) {
        for (let y = 0; y < buffer.height; ++y) {
          buffer.putPixel(
            x,
            y,
            new Color(Math.random(), Math.random(), Math.random(), 1.0)
          );
        }
      }
    }
  },
  {
    onPointerMove(p) {
      pointer = p;
    },
  }
);
