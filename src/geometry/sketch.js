class Sketch {
  constructor(p) {
    this.path = new p.Path();
  }
}

class sketchBuilder {
  #p;
  constructor(p, sketch = new Sketch(p)) {
    this.#p = p;
    this.sketch = sketch;
    this.path = this.sketch.path;
  }

  get line() {
    return new SketchLineBuilder(this.#p, this.sketch);
  }

  get curve() {
    return new SketchCurveBuilder(this.#p, this.sketch);
  }

  from(x, y) {
    const point = this._getPoint(x, y);
    this.path.add(point);
    return this;
  }

  close() {
    this.path.add(this.path.segments[0].point);
    return this;
  }

  _getPoint(x, y) {
    if (x instanceof this.#p.Point) {
      return x;
    } else if (typeof x === "number" && typeof y === "number") {
      return new this.#p.Point(x, y);
    } else {
      throw new Error("Invalid parameters for point creation");
    }
  }

  build() {
    return this.path;
  }
}

class SketchLineBuilder extends sketchBuilder {
  constructor(p, sketch) {
    super(p, sketch);
  }

  lineTo(x, y) {
    const point = this._getPoint(x, y);
    this.path.add(point);
    return this;
  }
}

class SketchCurveBuilder extends sketchBuilder {
  constructor(p, sketch) {
    super(p, sketch);
  }

  arcTo(x, y, clockWise = true) {
    const point = this._getPoint(x, y);
    this.path.arcTo(point, clockWise);
    return this;
  }
}

export default sketchBuilder;
