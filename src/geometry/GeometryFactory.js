import RectangelFactory from "./RectangleFactory.js";
class Shape {
  #p;
  constructor(p) {
    this.#p = p;
    this.path;
  }
}

class GeometryFactory {
  #p;
  #center;
  #scale;
  #shape;
  constructor(p, shape = new Shape(p)) {
    this.#p = p;
    this.#shape = shape;
  }

  get circle() {
    return new CicleFactory(this.#p, this.#shape);
  }

  get rectangle() {
    return new RectangelFactory(this.#p, this.#shape);
  }
}

class CicleFactory {
  #p;
  #radius;
  #center;
  #scale;
  #path;
  constructor(p, shape) {
    this.#p = p;
    this.#path = shape.path;
  }

  get radius() {
    return this.#radius;
  }

  radius(r) {
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

  build() {
    if (this.#radius) {
      this.#path = new this.#p.Path.Circle(this.#center, this.#radius);
    } else {
      alert("must specify radius for creating circle");
    }
    !this.#scale ?? this.#path.scale(this.scale);

    return this.#path;
  }
}

export default GeometryFactory;
