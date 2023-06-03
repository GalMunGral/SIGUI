import { Color, setup } from "../modules/utils.js";
import { makeText } from "../modules/font.js";

const canvas = document.querySelector("#font");
const inputSize = document.querySelector("#font-size");
const inputText = document.querySelector("#font-text");

let dirty = true;

inputSize.oninput = inputText.oninput = () => {
  dirty = true;
};

setup(canvas, (buffer) => {
  if (dirty) {
    dirty = false;
    buffer.clear();
    makeText(inputText.value, 50, buffer.height / 2, +inputSize.value).fill(
      buffer,
      () => Color.BLACK
    );
  }
});
