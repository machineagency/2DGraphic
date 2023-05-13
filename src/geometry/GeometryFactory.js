import RectangelFactory from "./RectangleFactory.js";
import CircleFactory from "./CircleFactory.js";
class Shape {
  #p;
  constructor(p) {
    this.#p = p;
    this.path;
  }
}

class GeometryFactory {
  #p;
  #shape;
  constructor(p, shape = new Shape(p)) {
    this.#p = p;
    this.#shape = shape;
  }

  get circle() {
    return new CircleFactory(this.#p, this.#shape);
  }

  get rectangle() {
    return new RectangelFactory(this.#p, this.#shape);
  }
}

export default GeometryFactory;
