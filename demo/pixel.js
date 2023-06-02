import { Color, setup } from "../modules/utils.js";

const canvas = document.querySelector("#pixel");

let rendered = false;
setup(canvas, (buffer) => {
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
});
