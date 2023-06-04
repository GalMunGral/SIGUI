import { Color, setup } from "../modules/utils.js";
import { FontBook, makeText } from "../modules/font.js";
import { parse } from "https://unpkg.com/opentype.js/dist/opentype.module.js";

const canvas = document.querySelector("#font");
const inputSize = document.querySelector("#font-size");
const inputText = document.querySelector("#font-text");
const fontInput = document.querySelector("#font-file");

const highlightColor = new Color(0.6, 0.0, 0.0);

let dirty = true;
let font = FontBook.Zapfino;

inputSize.oninput = inputText.oninput = () => {
  dirty = true;
};

fontInput.oninput = async () => {
  font = parse(await fontInput.files[0].arrayBuffer());
  dirty = true;
};

let textBoundary;
let pointerInside = false;

setup(
  canvas,
  (buffer) => {
    if (dirty) {
      dirty = false;
      textBoundary = makeText(
        inputText.value,
        100,
        buffer.height / 2,
        +inputSize.value * devicePixelRatio,
        font
      );
      buffer.clear();
      textBoundary.fill(buffer, () =>
        pointerInside ? highlightColor : Color.BLACK
      );
    }
  },
  {
    onPointerMove(p) {
      if (textBoundary && textBoundary.contains(p) != pointerInside) {
        pointerInside = !pointerInside;
        dirty = true;
      }
    },
  }
);
