class RectangelFactory {
  #p;
  #path;
  #height;
  #width;
  #topLeft;
  #topRight;
  #bottomLeft;
  #bottomRight;
  #center;
  #depth = Infinity;
  #scale;
  constructor(p, shape) {
    this.#p = p;
    this.#path = shape.path;
  }

  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  get topLeft() {
    return this.#topLeft;
  }
  get topRight() {
    return this.#topRight;
  }
  get bottomLeft() {
    return this.#bottomLeft;
  }
  get bottomRight() {
    return this.#bottomRight;
  }

  setHeight(h) {
    this.#height = h;
    return this;
  }
  setWidth(w) {
    this.#width = w;
    return this;
  }
  setTopLeft(x, y) {
    const point = getPoint(x, y, this.#p);
    this.#topLeft = point;
    return this;
  }
  setTopRight(x, y) {
    const point = getPoint(x, y, this.#p);
    this.#topRight = point;
    return this;
  }
  setBottomLeft(x, y) {
    const point = getPoint(x, y, this.#p);
    this.#bottomLeft = point;
    return this;
  }
  setBottomRight(x, y) {
    const point = getPoint(x, y, this.#p);
    this.#bottomRight = point;
    return this;
  }

  centerAt(x, y) {
    const point = getPoint(x, y, this.#p);
    this.#center = point;
    return this;
  }

  setDepth(number) {
    this.#depth = number;
    return this;
  }

  scale(number) {
    this.#scale = number;
    return this;
  }

  build() {
    if (
      (this.#topLeft && this.#bottomRight) ||
      (this.#topRight && this.#bottomLeft) ||
      (this.#width && this.#height && this.#center)
    ) {
      if (this.#topLeft && this.#bottomRight) {
        this.#path = new this.#p.Path.Rectangle(
          this.#topLeft,
          this.#bottomRight
        );
      } else if (this.#topRight && this.#bottomLeft) {
        let tl = this.#p.Point(this.#bottomLeft.x, this.#topRight.y);
        let br = this.#p.Point(this.#topRight.x, this.#bottomLeft.y);
        this.#path = new this.#p.Path.Rectangle(tl, br);
      } else if (this.#width && this.#height && this.center !== null) {
        let size = new this.#p.Size(this.#width, this.#height);
        this.#path = new this.#p.Path.Rectangle(this.#center, size);
      } else {
        alert("the rectangle is problematic, check the code");
      }
      if (this.#scale != null) {
        this.#path.scale(this.scale);
      }
      if (this.#depth != null) {
        this.#path.depth = this.#depth;
      }
      return this.#path;
    } else {
      console.log("rectangle is underspecified");
    }
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

export default RectangelFactory;
