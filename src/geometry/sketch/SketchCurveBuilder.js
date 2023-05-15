import SketchSegmentBuilder from "./SketchSegmentBuilder.js";

class SketchCurveBuilder {
  #p;
  #sketch;
  constructor(p, sketch) {
    this.#p = p;
    this.#sketch = sketch;
  }

  to(point) {
    return new SketchCurveBuilderTo(
      this.#p,
      this.#sketch,
      getPoint(point, this.#p)
    );
  }
}

class SketchCurveBuilderTo {
  #p;
  #sketch;
  #to;
  constructor(p, sketch, to) {
    this.#p = p;
    this.#sketch = sketch;
    this.#to = to;
  }

  through(point) {
    const throughPoint = getPoint(point, this.#p);
    this.#sketch.path.curveTo(throughPoint, this.#to);
    return new SketchSegmentBuilder(this.#p, this.#sketch);
  }
}

function getPoint(point, p) {
  if (Array.isArray(point)) {
    return new p.Point(point[0], point[1]);
  } else {
    return point;
  }
}

export default SketchCurveBuilder;
