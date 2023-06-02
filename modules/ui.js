import { setup } from "./utils.js";

export class UIRenderer {
  pending = [];
  committed = [];

  constructor(canvas, root) {
    this.root = root;
    setup(
      canvas,
      (buffer) => {
        if (this.pending.length) {
          this.commit(buffer);
        }
      },
      {
        onClick: (p) => {
          const comp = this.hitTest(p);
          if (comp?.handleClick?.(p)) {
            this.root.render(this);
          }
        },
        onPointerDown: (p) => {
          const comp = this.hitTest(p);
          if (comp?.handlePointerDown?.(p)) {
            this.root.render(this);
          }
        },
        onPointerMove: (p) => {
          const comp = this.hitTest(p);
          if (comp?.handlePointerMove?.(p)) {
            this.root.render(this);
          }
        },
        onPointerUp: (p) => {
          const comp = this.hitTest(p);
          if (comp?.handlePointerUp?.(p)) {
            this.root.render(this);
          }
        },
      }
    );
    this.root.layout(canvas.width / 2, canvas.height / 2);
    this.root.render(this);
  }

  hitTest(p) {
    for (const { component, polygon } of this.committed) {
      if (polygon.contains(p)) {
        return component;
      }
    }
  }

  render(component, polygon, color) {
    this.pending.push({ component, polygon, color });
  }

  commit(buffer) {
    buffer.clear();
    this.pending.forEach(({ polygon, color }) => {
      polygon.fill(buffer, color);
    });
    this.committed = this.pending.reverse();
    this.pending = [];
  }
}
