export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

  requestAnimationFrame(function draw() {
    drawFn(imageData);
    ctx.putImageData(imageData, 0, 0);
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

export const black = [0.0, 0.0, 0.0, 1.0];

// helpers
export function mult(vec, s) {
  return vec.map((v) => v * s);
}

export function add(vec1, vec2) {
  return vec1.map((v, i) => v + vec2[i]);
}

export function round(vec) {
  return vec.map((v) => Math.round(v));
}

export function dist(vec1, vec2) {
  return Math.sqrt(vec1.reduce((sum, v, i) => sum + (v - vec2[i]) ** 2, 0));
}
