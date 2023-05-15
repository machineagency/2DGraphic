import SketchSegmentBuilder from "./SketchSegmentBuilder.js";
class SketchLineBuilder {
  #p;
  #sketch;
  #path;
  #to;
  constructor(p, sketch) {
    this.#p = p;
    this.#sketch = sketch;
    this.#path = sketch.path;
  }

  to(point) {
    this.#to = getPoint(point, this.#p);
    this.#path.add(this.#to);
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

export default SketchLineBuilder;
