import { simplePolygon } from "../modules/polygon.js";
import { UIRenderer } from "../modules/ui.js";
import { Color, Point } from "../modules/utils.js";
import { sampleBezier } from "../modules/bezier.js";
import { font, makeText } from "../modules/font.js";

const canvas = document.querySelector("#recursion");
const buttonHeightInput = document.querySelector("#button-height");
const buttonWidthInput = document.querySelector("#button-width");
const buttonRadiusInput = document.querySelector("#button-radius");

class Box {
  static width = 800;
  static height = 500;

  active = false;

  constructor(buttons) {
    this.buttons = buttons;
  }

  handlePointerDown() {
    this.active = true;
    return true;
  }

  handlePointerUp() {
    this.active = false;
    return true;
  }

  layout(centerX, centerY) {
    const n = this.buttons.length;
    const spacing = (Box.height - n * Button.height) / (n + 1);
    if (spacing < 0) throw new Error("not enough space");

    const left = centerX - Box.width / 2;
    const right = centerX + Box.width / 2;
    const top = centerY - Box.height / 2;
    const bottom = centerY + Box.height / 2;

    const p1 = new Point(left, top);
    const p2 = new Point(right, top);
    const p3 = new Point(right, bottom);
    const p4 = new Point(left, bottom);

    this.geometry = simplePolygon([p1, p2, p3, p4]);

    let y = top + spacing + Button.height / 2;
    for (const child of this.buttons) {
      child.layout(centerX, y);
      y += spacing + Button.height;
    }
  }

  render(renderer) {
    const color = this.active
      ? new Color(0.9, 0.8, 0.8)
      : new Color(0.9, 0.9, 0.9);
    renderer.render(this, this.geometry, () => color);

    for (const child of this.buttons) {
      child.render(renderer);
    }
  }
}

class Button {
  static width = 400;
  static height = 150;
  static radius = 50;

  active = false;
  hover = false;

  constructor(label, blurEffect = false) {
    this.text = new Text(label);
    this.blurEffect = blurEffect;
  }

  handlePointerOver() {
    this.hover = true;
    return true;
  }

  handlePointerOut() {
    this.hover = false;
    this.active = false;
    return true;
  }

  handlePointerDown() {
    this.active = true;
    return true;
  }

  handlePointerUp() {
    this.active = false;
    return true;
  }

  layout(centerX, centerY) {
    const left = centerX - Button.width / 2;
    const right = centerX + Button.width / 2;
    const top = centerY - Button.height / 2;
    const bottom = centerY + Button.height / 2;

    const radius = Math.min(Button.radius, Button.height / 2, Button.width / 2);

    this.geometry = simplePolygon([
      ...sampleBezier([
        new Point(left, top + radius),
        new Point(left, top),
        new Point(left + radius, top),
      ]),
      ...sampleBezier([
        new Point(right - radius, top),
        new Point(right, top),
        new Point(right, top + radius),
      ]),
      ...sampleBezier([
        new Point(right, bottom - radius),
        new Point(right, bottom),
        new Point(right - radius, bottom),
      ]),
      ...sampleBezier([
        new Point(left + radius, bottom),
        new Point(left, bottom),
        new Point(left, bottom - radius),
      ]),
    ]);

    const offsetX = 4;
    const offsetY = 4;

    this.shadowGeometry = this.geometry
      .translate(-centerX, -centerY)
      .translate(centerX + offsetX, centerY + offsetY);

    const paddingX = 64;
    const paddingY = 32;

    this.text.layout(
      centerX,
      centerY,
      right - left - 2 * paddingX,
      bottom - top - 2 * paddingY
    );

    this.blurGeometry = simplePolygon([
      new Point(left + paddingX, top + paddingY),
      new Point(right - paddingX, top + paddingY),
      new Point(right - paddingX, bottom - paddingY),
      new Point(left + paddingX, bottom - paddingY),
    ]);
  }

  render(renderer) {
    const shadowColor = new Color(0.5, 0.5, 0.5, 0.5);
    const backgroundColor = this.active
      ? new Color(15 / 255, 137 / 255, 88 / 255)
      : this.hover
      ? new Color(15 / 255, 177 / 255, 88 / 255)
      : new Color(15 / 255, 157 / 255, 88 / 255);

    if (this.blurEffect && !this.hover) {
      renderer.blur(this.blurGeometry);
    }

    renderer.render(this, this.shadowGeometry, () => shadowColor);
    renderer.render(this, this.geometry, () => backgroundColor);
    this.text.render(renderer);
  }
}

class Text {
  constructor(text) {
    this.text = text;
  }

  layout(centerX, centerY, width, height) {
    let fontSize = height;
    let textWidth;

    while (fontSize > 0) {
      const path = font.getPath(this.text, 0, 0, fontSize);
      const rect = path.getBoundingBox();
      textWidth = rect.x2 - rect.x1;
      if (textWidth < width) break;
      --fontSize;
    }

    this.geometry = makeText(
      this.text,
      centerX - textWidth / 2,
      centerY + fontSize / 4,
      fontSize
    );
  }

  render(renderer) {
    // don't fire events on text
    renderer.render(null, this.geometry, () => Color.WHITE);
  }
}

const UI = new UIRenderer(
  canvas,
  new Box([new Button("I'm a button"), new Button("click me")])
);

buttonWidthInput.value = Button.width;
buttonWidthInput.oninput = () => {
  Button.width = +buttonWidthInput.value;
  UI.update();
};

buttonHeightInput.value = Button.height;
buttonHeightInput.oninput = () => {
  Button.height = +buttonHeightInput.value;
  UI.update();
};

buttonRadiusInput.value = Button.radius;
buttonRadiusInput.oninput = () => {
  Button.radius = +buttonRadiusInput.value;
  UI.update();
};
