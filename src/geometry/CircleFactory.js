class CircleFactory {
  #p;
  #radius;
  #center;
  #depth = Infinity;
  #scale;
  #path;
  constructor(p, shape) {
    this.#p = p;
    this.#path = shape.path;
  }

  get radius() {
    return this.#radius;
  }

  setRadius(r) {
    this.#radius = r;
    return this;
  }

  centerAt(x, y) {
    const point = getPoint(x, y, this.#p);
    this.#center = point;
    return this;
  }

  scale(number) {
    this.#scale = number;
    return this;
  }

  setDepth(number) {
    this.#depth = number;
    return this;
  }

  build() {
    if (this.#radius) {
      this.#path = new this.#p.Path.Circle(this.#center, this.#radius);
    } else {
      alert("must specify radius for creating circle");
    }
    if (this.#scale != null) {
      this.#path.scale(this.scale);
    }
    if (this.#depth != null) {
      this.#path.depth = this.#depth;
    }

    return this.#path;
  }
}

function getPoint(x, y, p) {
  if (x instanceof p.Point) {
    return x;
  } else if (typeof x === "number" && typeof y === "number") {
    return new p.Point(x, y);
  } else {
    throw new Error("Invalid parameters for point creation");
  }
}
export default CircleFactory;
