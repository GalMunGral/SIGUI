import { setup } from "../modules/utils.js";
import { clear } from "../modules/pixel.js";
import { fillPolygon, hitTest, polygon } from "../modules/polygon.js";
import { drawText, font } from "../modules/font.js";
import { makeBezier } from "../modules/bezier.js";

const canvas = document.querySelector("#recursion");
const { image, onClick } = setup(canvas);

const labels = ["Foo", "Bar", "Baz"];

let events = {};
let dirty = true;

requestAnimationFrame(function draw() {
  if (dirty) {
    clear(image);
    box(image.width / 2, image.height / 2, labels, events);
    dirty = false;
    events = {};
  }
  requestAnimationFrame(draw);
});

onClick((x, y) => {
  events.clickX = x;
  events.clickY = y;
  dirty = true;
});

function box(centerX, centerY, labels, events) {
  const boxWidth = 800;
  const boxHeight = 500;
  const buttonWidth = 100;
  const buttonHeight = 60;

  const left = centerX - boxWidth / 2;
  const right = centerX + boxWidth / 2;
  const top = centerY - boxHeight / 2;
  const bottom = centerY + boxHeight / 2;

  const buttonCount = labels.length;
  const spacing = (boxHeight - buttonCount * buttonHeight) / (buttonCount + 1);
  if (spacing < 0) throw "not enough space";

  const boundary = polygon([
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ]);

  const { clickX, clickY } = events;
  const hit = hitTest([clickX, clickY], boundary);
  const color = hit ? [1, 0.9, 0.9, 1] : [1, 1, 0.9, 1];
  fillPolygon(image, boundary, () => color);

  let buttonCenterY = top + spacing + buttonHeight / 2;
  for (let i = 0; i < buttonCount; ++i) {
    button(
      labels[i],
      centerX,
      buttonCenterY,
      buttonWidth,
      buttonHeight,
      events
    );
    buttonCenterY += spacing + buttonHeight;
  }
}

class Button {
  needLayout = true;
  offsetX = 5;
  offsetY = 5;
  radius = 40;
  constructor(centerX, centerY) {}

  layout(centerX, centerY, width, height) {
    if (!this.needLayout) return;
    this.needLayout = false;
    this.shadowLeft = centerX - width + offsetX;
    this.shadowRight = centerX + width + offsetX;
    this.shadowTop = centerY - height + offsetY;
    this.shadowBottom = centerY + height + offsetY;
    this.left = centerX - width;
    this.right = centerX + width;
    this.top = centerY - height;
    this.bottom = centerY + height;

    this.shadowBoundary = polygon([
      ...makeBezier(
        [shadowLeft, shadowTop + radius],
        [shadowLeft, shadowTop],
        [shadowLeft + radius, shadowTop]
      ),
      ...makeBezier(
        [shadowRight - radius, shadowTop],
        [shadowRight, shadowTop],
        [shadowRight, shadowTop + radius]
      ),
      ...makeBezier(
        [shadowRight, shadowBottom - radius],
        [shadowRight, shadowBottom],
        [shadowRight - radius, shadowBottom]
      ),
      ...makeBezier(
        [shadowLeft + radius, shadowBottom],
        [shadowLeft, shadowBottom],
        [shadowLeft, shadowBottom - radius]
      ),
    ]);

    this.backgroundBoundary = polygon([
      ...makeBezier([left, top + radius], [left, top], [left + radius, top]),
      ...makeBezier([right - radius, top], [right, top], [right, top + radius]),
      ...makeBezier(
        [right, bottom - radius],
        [right, bottom],
        [right - radius, bottom]
      ),
      ...makeBezier(
        [left + radius, bottom],
        [left, bottom],
        [left, bottom - radius]
      ),
    ]);
  }

  hitTest({ clickX, clickY }) {
    return hitTest([clickX, clickY], this.backgroundBoundary);
  }
}

//   const backgroundColor = hit
//     ? [0.5, 0.5, 0.5, 1]
//     : [15 / 255, 157 / 255, 88 / 255, 1];

//   const shadowAlpha = (x, y) => {
//     const dist = Math.min(
//       x - shadowLeft,
//       shadowRight - x,
//       y - shadowTop,
//       shadowBottom - y
//     );

//     const maxDist = Math.max(
//       shadowRight - shadowLeft,
//       shadowBottom - shadowTop
//     );
//     return (dist / maxDist) ** 0.5;
//   };

//   fillPolygon(image, shadowBoundary, (x, y) => [0, 0, 0, shadowAlpha(x, y)]);
//   fillPolygon(image, backgroundBoundary, () => backgroundColor);
//   text(label, centerX, centerY, width, height);
// }

function text(s, centerX, centerY, width, height) {
  let fontSize = height;
  let textWidth;

  while (fontSize > 0) {
    const path = font.getPath(s, 0, 0, fontSize);
    const rect = path.getBoundingBox();
    textWidth = rect.x2 - rect.x1;
    if (textWidth < width) break;
    --fontSize;
  }

  const x = centerX - textWidth / 2;
  const y = centerY + fontSize / 4;

  drawText(image, s, x, y, fontSize, () => [1, 1, 1, 1]);
}
