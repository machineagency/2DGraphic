class Sketch {
  constructor(p) {
    this.path = new p.Path();
  }
}

class SketchBuilder {
  #p;
  #path;
  constructor(p, sketch = new Sketch(p)) {
    this.#p = p;
    this.sketch = sketch;
    this.#path = this.sketch.path;
  }

  get line() {
    return new SketchLineBuilder(this.#p, this.sketch);
  }

  get curve() {
    return new SketchCurveBuilder(this.#p, this.sketch);
  }

  get bezier() {
    return new SketchBezierBuilder(this.#p, this.sketch);
  }

  from(point) {
    const p = getPoint(point, this.#p);
    this.#path.add(point);
    return this;
  }

  close() {
    this.#path.add(this.#path.segments[0].point);
    return this;
  }

  return() {
    return this.#path;
  }
}

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
    return this;
  }

  draw() {
    this.#path.add(this.#to);
    return new SketchBuilder(this.#p, this.#sketch);
  }
}

class SketchCurveBuilder {
  #p;
  #sketch;
  #path;
  #through;
  #to;
  constructor(p, sketch) {
    this.#p = p;
    this.#sketch = sketch;
    this.#path = sketch.path;
  }

  to(point) {
    this.#to = getPoint(point, this.#p);
    return this;
  }

  through(point) {
    this.#through = getPoint(point, this.#p);
    return this;
  }

  draw() {
    if (this.#through && this.#to) {
      this.#path.curveTo(this.#through, this.#to);
    } else {
      throw Error("through and to must be defined");
    }
    return new SketchBuilder(this.#p, this.#sketch);
  }
}

class SketchBezierBuilder {
  #p;
  #sketch;
  #path;
  #handle1;
  #handle2;
  #to;
  constructor(p, sketch) {
    this.#p = p;
    this.#sketch = sketch;
    this.#path = sketch.path;
  }

  to(point) {
    this.#to = getPoint(point, this.#p);
    return this;
  }

  handle1(point) {
    this.#handle1 = getPoint(point, this.#p);
    return this;
  }

  handle2(point) {
    this.#handle2 = getPoint(point, this.#p);
    return this;
  }

  draw() {
    if (this.#handle1 && this.#handle2 && this.#to) {
      this.#path.cubicCurveTo(this.#handle1, this.#handle2, this.#to);
    } else {
      throw Error("through and to must be defined");
    }
    return new SketchBuilder(this.#p, this.#sketch);
  }
}

function getPoint(point, p) {
  if (Array.isArray(point)) {
    return new p.Point(point[0], point[1]);
  } else {
    return point;
  }
}

export default SketchBuilder;
