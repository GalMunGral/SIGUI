import { Edge, Polygon, simplePolygon } from "../modules/polygon.js";
import { UIRenderer } from "../modules/ui.js";
import { Color, Point } from "../modules/utils.js";
import { sampleBezier } from "../modules/bezier.js";
import { font, makeText } from "../modules/font.js";

const canvas = document.querySelector("#recursion");

class Box {
  static width = 800;
  static height = 500;

  active = false;
  constructor(buttons) {
    this.children = buttons.map((label) => new Button(label));
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
    const n = this.children.length;
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
    for (const child of this.children) {
      child.layout(centerX, y);
      y += spacing + Button.height;
    }
  }

  render(renderer) {
    const color = this.active ? new Color(1, 0.9, 0.9) : new Color(1, 1, 0.9);
    renderer.render(this, this.geometry, () => color);

    for (const child of this.children) {
      child.render(renderer);
    }
  }
}

class Button {
  static width = 100;
  static height = 60;
  static radius = 40;

  active = false;
  constructor(label) {
    this.text = new Text(label);
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
    const offsetX = 5;
    const offsetY = 5;

    const sLeft = centerX - Button.width + offsetX;
    const sRight = centerX + Button.width + offsetX;
    const sTop = centerY - Button.height + offsetY;
    const sBottom = centerY + Button.height + offsetY;

    this.shadowGeometry = simplePolygon([
      ...sampleBezier([
        new Point(sLeft, sTop + Button.radius),
        new Point(sLeft, sTop),
        new Point(sLeft + Button.radius, sTop),
      ]),
      ...sampleBezier([
        new Point(sRight - Button.radius, sTop),
        new Point(sRight, sTop),
        new Point(sRight, sTop + Button.radius),
      ]),
      ...sampleBezier([
        new Point(sRight, sBottom - Button.radius),
        new Point(sRight, sBottom),
        new Point(sRight - Button.radius, sBottom),
      ]),
      ...sampleBezier([
        new Point(sLeft + Button.radius, sBottom),
        new Point(sLeft, sBottom),
        new Point(sLeft, sBottom - Button.radius),
      ]),
    ]);

    this.shadowColor = (x, y) => {
      const dist = Math.min(x - sLeft, sRight - x, y - sTop, sBottom - y);
      const maxDist = Math.max(sRight - sLeft, sBottom - sTop);
      return new Color(0, 0, 0, (dist / maxDist) ** 0.5);
    };

    const left = centerX - Button.width;
    const right = centerX + Button.width;
    const top = centerY - Button.height;
    const bottom = centerY + Button.height;

    this.geometry = simplePolygon([
      ...sampleBezier([
        new Point(left, top + Button.radius),
        new Point(left, top),
        new Point(left + Button.radius, top),
      ]),
      ...sampleBezier([
        new Point(right - Button.radius, top),
        new Point(right, top),
        new Point(right, top + Button.radius),
      ]),
      ...sampleBezier([
        new Point(right, bottom - Button.radius),
        new Point(right, bottom),
        new Point(right - Button.radius, bottom),
      ]),
      ...sampleBezier([
        new Point(left + Button.radius, bottom),
        new Point(left, bottom),
        new Point(left, bottom - Button.radius),
      ]),
    ]);

    const padding = 20;
    this.text.layout(
      centerX,
      centerY,
      right - left - 2 * padding,
      bottom - top - 2 * padding
    );
  }

  render(renderer) {
    const backgroundColor = this.active
      ? new Color(0.5, 0.5, 0.5)
      : new Color(15 / 255, 157 / 255, 88 / 255);

    renderer.render(this, this.shadowGeometry, this.shadowColor);
    renderer.render(this, this.geometry, () => backgroundColor);

    this.text.render(renderer);
  }
}

class Text {
  active = false;
  constructor(text) {
    this.text = text;
  }

  handlePointerDown() {
    this.active = true;
    return true;
  }

  handlePointerUp() {
    this.active = false;
    return true;
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
    const textColor = this.active ? Color.RED : Color.WHITE;
    renderer.render(this, this.geometry, () => textColor);
  }
}

new UIRenderer(
  canvas,
  new Box(["Foo", "Bar", "Baz"], { centerX: 0, centerY: 0 })
);
