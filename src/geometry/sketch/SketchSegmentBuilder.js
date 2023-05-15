import SketchBezierBuilder from "./SketchBezierBuilder.js";
import SketchCurveBuilder from "./SketchCurveBuilder.js";
import SketchLineBuilder from "./SketchLineBuilder.js";
class SketchSegmentBuilder {
  #p;
  #sketch;

  constructor(p, sketch) {
    this.#p = p;
    this.#sketch = sketch;
  }

  get line() {
    return new SketchLineBuilder(this.#p, this.#sketch);
  }

  get curve() {
    return new SketchCurveBuilder(this.#p, this.#sketch);
  }

  get bezier() {
    return new SketchBezierBuilder(this.#p, this.#sketch);
  }

  close() {
    this.#sketch.path.closePath();
    return this;
  }

  return() {
    return this.#sketch.path;
  }
}

export default SketchSegmentBuilder;
