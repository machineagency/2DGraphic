import SketchBezierBuilder from "./SketchBezierBuilder.js";
import SketchCurveBuilder from "./SketchCurveBuilder.js";
import SketchLineBuilder from "./SketchLineBuilder.js";
import config from "../../config.js";
class SketchSegmentBuilder {
  #p;
  #sketch;
  #height;
  #depth;

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

  cutAtDepth(depth) {
    this.#depth = depth;
    return this;
  }

  fromBaseWithHeight(height) {
    this.#height = height;
    return this;
  }

  return() {
    if (this.#height !== null || this.#height !== undefined) {
      this.#depth = config.canvas.depth - this.#height;
      this.#sketch.path.height = this.#height;
    } else if (this.#depth !== null || this.#depth !== undefined) {
      this.#height = config.canvas.depth - this.#depth;
      this.#sketch.path.depth = this.#depth;
    } else {
      throw new Error(
        "must specify the if the feature topDown or bottomUp, by calling cutAtDepth or fromBaseWithHeight"
      );
    }

    return this.#sketch.path;
  }
}

export default SketchSegmentBuilder;
