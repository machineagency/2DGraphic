import SketchBezierBuilder from "./SketchBezierBuilder.js";
import SketchCurveBuilder from "./SketchCurveBuilder.js";
import SketchLineBuilder from "./SketchLineBuilder.js";
class SketchSegmentBuilderAfterFrom {
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
}

export default SketchSegmentBuilderAfterFrom;
