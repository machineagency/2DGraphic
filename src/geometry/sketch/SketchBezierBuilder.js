import SketchSegmentBuilder from "./SketchSegmentBuilder.js";
class SketchBezierBuilder {
  #p;
  #sketch;
  constructor(p, sketch) {
    this.#p = p;
    this.#sketch = sketch;
  }

  to(point) {
    return new SketchBezierBuilderHandle1(
      this.#p,
      this.#sketch,
      getPoint(point, this.#p)
    );
  }
}

class SketchBezierBuilderHandle1 {
  #p;
  #sketch;
  #to;
  constructor(p, sketch, to) {
    this.#p = p;
    this.#sketch = sketch;
    this.#to = to;
  }

  handle1(point) {
    return new SketchBezierBuilderHandle2(
      this.#p,
      this.#sketch,
      this.#to,
      getPoint(point, this.#p)
    );
  }
}

class SketchBezierBuilderHandle2 {
  #p;
  #sketch;
  #to;
  #handle1;
  constructor(p, sketch, to, handle1) {
    this.#p = p;
    this.#sketch = sketch;
    this.#to = to;
    this.#handle1 = handle1;
  }

  handle2(point) {
    const handle2 = getPoint(point, this.#p);
    this.#sketch.path.cubicCurveTo(this.#handle1, handle2, this.#to);
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

export default SketchBezierBuilder;
