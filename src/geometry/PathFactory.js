import GeometryFactory from "./GeometryFactory.js";
import SketchBuilder from "./sketch.js";
class PathFactory {
  #p;
  constructor(p) {
    this.#p = p;
  }

  get Sketch() {
    return new SketchBuilder(this.#p);
  }

  get Shape() {
    return new GeometryFactory(this.#p);
  }
}

export default PathFactory;
