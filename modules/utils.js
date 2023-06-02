export class Point {
  constructor(x, y) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error("invalid coordinates!");
    }
    this.x = x;
    this.y = y;
  }

  dist(other) {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  translate(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
  }

  rotate(theta) {
    return new Point(
      this.x * Math.cos(theta) - this.y * Math.sin(theta),
      this.x * Math.sin(theta) + this.y * Math.cos(theta)
    );
  }

  scale(c) {
    return new Point(this.x * c, this.y * c);
  }

  interpolate(other, t) {
    return new Point(
      (1 - t) * this.x + t * other.x,
      (1 - t) * this.y + t * other.y
    );
  }
}

export class Color {
  static WHITE = new Color(1, 1, 1);
  static BLACK = new Color(0, 0, 0);
  static RED = new Color(1, 0, 0);
  static TRANSPARENT = new Color(0, 0, 0, 0);

  static parse(s) {
    const r = parseInt(s.slice(1, 3), 16) / 255;
    const g = parseInt(s.slice(3, 5), 16) / 255;
    const b = parseInt(s.slice(5, 7), 16) / 255;
    return new Color(r, g, b);
  }

  constructor(r, g, b, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  interpolate(other, t) {
    return new Color(
      (1 - t) * this.r + t * other.r,
      (1 - t) * this.g + t * other.g,
      (1 - t) * this.b + t * other.b,
      (1 - t) * this.a + t * other.a
    );
  }

  over(other) {
    const a = this.a + other.a * (1 - this.a);
    const w1 = this.a / a;
    const w2 = (other.a * (1 - this.a)) / a;
    return new Color(
      this.r * w1 + other.r * w2,
      this.g * w1 + other.g * w2,
      this.b * w1 + other.b * w2,
      a
    );
  }
}

export class Buffer {
  dirty = false;

  constructor(imageData) {
    this.buffer = imageData.data;
    this.width = imageData.width;
    this.height = imageData.height;
    this.pixels = new Array(imageData.width * imageData.height).fill(
      Color.TRANSPARENT
    );
  }

  putPixel(x, y, color) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const i = y * this.width + x;
    const { r, g, b, a } = (this.pixels[i] = color.over(this.pixels[i]));
    this.buffer[i * 4] = r * 255;
    this.buffer[i * 4 + 1] = g * 255;
    this.buffer[i * 4 + 2] = b * 255;
    this.buffer[i * 4 + 3] = a * 255;
    this.dirty = true;
  }

  clear() {
    this.pixels.fill(Color.TRANSPARENT);
    this.buffer.fill(0);
    this.dirty = true;
  }
}

export function setup(
  canvas,
  drawFn,
  { onClick, onPointerDown, onPointerUp, onPointerMove } = {}
) {
  const dpr = devicePixelRatio;
  const width = (canvas.width = canvas.clientWidth * dpr);
  const height = (canvas.height = canvas.clientHeight * dpr);

  const ctx = canvas.getContext("2d");
  const imageData = new ImageData(width, height);

  canvas.addEventListener("pointerdown", (e) => {
    onPointerDown?.(new Point(e.offsetX * dpr, e.offsetY * dpr));
  });

  canvas.addEventListener("pointerup", (e) => {
    onPointerUp?.(new Point(e.offsetX * dpr, e.offsetY * dpr));
  });

  canvas.addEventListener("pointermove", (e) => {
    onPointerMove?.(new Point(e.offsetX * dpr, e.offsetY * dpr));
  });

  canvas.addEventListener("click", (e) => {
    onClick?.(new Point(e.offsetX * dpr, e.offsetY * dpr));
  });

  const buffer = new Buffer(imageData);

  requestAnimationFrame(function draw() {
    drawFn(buffer);
    if (buffer.dirty) {
      ctx.putImageData(imageData, 0, 0);
      buffer.dirty = false;
    }
    requestAnimationFrame(draw);
  });

  // let first = true;
  // function render() {
  //   first = true;
  //   ctx.putImageData(imageData, 0, 0);
  // }

  // const bufferMethodHandler = {
  //   apply(target, _, argumentsList) {
  //     if (first) {
  //       first = false;
  //       queueMicrotask(render);
  //     }
  //     return Reflect.apply(target, imageData.data, argumentsList);
  //   },
  // };

  // const bufferHandler = {
  //   get(target, prop, receiver) {
  //     const value = Reflect.get(target, prop, receiver);
  //     return typeof value == "function"
  //       ? new Proxy(value, bufferMethodHandler)
  //       : value;
  //   },
  //   set(target, prop, value, receiver) {
  //     if (first) {
  //       first = false;
  //       queueMicrotask(render);
  //     }
  //     return Reflect.set(target, prop, value, receiver);
  //   },
  // };

  // const handler = {
  //   get(target, prop) {
  //     const value = Reflect.get(target, prop, target);
  //     return prop == "data" ? new Proxy(value, bufferHandler) : value;
  //   },
  // };
}

// helpers
// export function mult(vec, s) {
//   return vec.map((v) => v * s);
// }

// export function add(vec1, vec2) {
//   return vec1.map((v, i) => v + vec2[i]);
// }

// export function round(vec) {
//   return vec.map((v) => Math.round(v));
// }
