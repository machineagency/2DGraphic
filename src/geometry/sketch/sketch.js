import SketchSegmentBuilderAfterFrom from "./SketchSegmentBuilderAfterFrom.js";

// Utility function for point creation
function getPoint(point, p) {
  if (Array.isArray(point)) {
    return new p.Point(point[0], point[1]);
  } else {
    return point;
  }
}

class Sketch {
  constructor(p) {
    this.path = new p.Path();
  }
}

class SketchBuilder {
  #p;
  #sketch;

  constructor(p, sketch = new Sketch(p)) {
    this.#p = p;
    this.#sketch = sketch;
  }

  from(point) {
    const p = getPoint(point, this.#p);
    this.#sketch.path.add(p);
    return new SketchSegmentBuilderAfterFrom(this.#p, this.#sketch);
  }
}

export default SketchBuilder;
