export function setup(canvas) {
  const dpr = devicePixelRatio;
  const width = (canvas.width = canvas.clientWidth * dpr);
  const height = (canvas.height = canvas.clientHeight * dpr);

  const ctx = canvas.getContext("2d");
  const imageData = new ImageData(width, height);

  function onClick(fn) {
    canvas.addEventListener("click", (e) => {
      fn(e.offsetX * dpr, e.offsetY * dpr);
    });
  }

  function onMove(fn) {
    canvas.addEventListener("mousemove", (e) => {
      fn(e.offsetX * dpr, e.offsetY * dpr);
    });
  }

  let isDragging = false;
  let x, y;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    x = e.offsetX * dpr;
    y = e.offsetY * dpr;
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  function onDrag(fn) {
    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const newX = e.offsetX * dpr;
        const newY = e.offsetY * dpr;
        fn(newX - x, newY - y);
        x = newX;
        y = newY;
      }
    });
  }

  let first = true;
  function render() {
    first = true;
    ctx.putImageData(imageData, 0, 0);
  }

  const bufferMethodHandler = {
    apply(target, _, argumentsList) {
      if (first) {
        first = false;
        queueMicrotask(render);
      }
      return Reflect.apply(target, imageData.data, argumentsList);
    },
  };

  const bufferHandler = {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return typeof value == "function"
        ? new Proxy(value, bufferMethodHandler)
        : value;
    },
    set(target, prop, value, receiver) {
      if (first) {
        first = false;
        queueMicrotask(render);
      }
      return Reflect.set(target, prop, value, receiver);
    },
  };

  const handler = {
    get(target, prop) {
      const value = Reflect.get(target, prop, target);
      return prop == "data" ? new Proxy(value, bufferHandler) : value;
    },
  };

  return {
    image: new Proxy(imageData, handler),
    onClick,
    onMove,
    onDrag,
  };
}

// helpers
export function scale(vec, s) {
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
