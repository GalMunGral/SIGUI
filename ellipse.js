import { setup } from "./utils.js";
import { clear, putPixel } from "./pixel.js";
import { compose, rotate, translate } from "./transform.js";
import { fillPolygon } from "./polygon.js";

const canvas = document.querySelector("#ellipse");
const inputN = document.querySelector("#ellipse-n");
const inputA = document.querySelector("#ellipse-a");
const inputB = document.querySelector("#ellipse-b");
const inputTheta = document.querySelector("#ellipse-theta");
const inputPhi1 = document.querySelector("#ellipse-phi-1");
const inputPhi2 = document.querySelector("#ellipse-phi-2");

const { image, onClick } = setup(canvas);

let cx = image.width / 2;
let cy = image.height / 2;
export let vertices = [[cx, cy]];

function draw() {
  const n = +inputN.value;
  const a = +inputA.value;
  const b = +inputB.value;
  const theta = +inputTheta.value * (Math.PI / 180);
  const phi1 = +inputPhi1.value * (Math.PI / 180);
  const phi2 = +inputPhi2.value * (Math.PI / 180);

  vertices.length = 1;
  for (let i = 0; i <= n; ++i) {
    vertices.push(
      compose(
        translate(cx, cy),
        rotate(theta)
      )([
        a * Math.cos(phi1 + (i * (phi2 - phi1)) / n),
        b * Math.sin(phi1 + (i * (phi2 - phi1)) / n),
      ])
    );
  }

  clear(image);
  fillPolygon(image, vertices, () => [0.0, 0.0, 0.0, 1.0]);
}

inputN.oninput = draw;
inputA.oninput = draw;
inputB.oninput = draw;
inputTheta.oninput = draw;
inputPhi1.oninput = draw;
inputPhi2.oninput = draw;
onClick((x, y) => {
  cx = x;
  cy = y;
});

draw();
