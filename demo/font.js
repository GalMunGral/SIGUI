import { Color, setup } from "../modules/utils.js";
import { makeText } from "../modules/font.js";

const canvas = document.querySelector("#font");
const inputSize = document.querySelector("#font-size");
const inputText = document.querySelector("#font-text");

let x = 0;
let y = +inputSize.value;
let dirty = true;

inputSize.oninput = inputText.oninput = () => {
  dirty = true;
};

setup(canvas, (buffer) => {
  if (dirty) {
    dirty = false;
    const text = inputText.value;
    const fontSize = +inputSize.value || 0;
    buffer.clear();
    makeText(text, x, y, fontSize).fill(buffer, () => Color.BLACK);
  }
});
