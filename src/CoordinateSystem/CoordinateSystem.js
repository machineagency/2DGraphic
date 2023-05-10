import CoordinateCalculator from "./CoordinateCalculator.js";
class CoordinateSystem {
  #p;
  #CoordinateCalculator;
  constructor(p) {
    this.#p = p;
    this.#CoordinateCalculator = new CoordinateCalculator();
  }

  getScale() {
    return this.#CoordinateCalculator.get();
  }

  srcPoint(viewPoint) {
    let gridScale = this.#CoordinateCalculator.get();
    return new this.#p.Point(
      (viewPoint.x - this.#p.view.center.x) / this.getScale(),
      (viewPoint.y - this.#p.view.center.y) / this.getScale()
    );
  }

  viewPoint(srcPoint) {
    return new this.#p.Point(
      srcPoint.x * this.getScale() + this.#p.view.center.x,
      srcPoint.y * this.getScale() + this.#p.view.center.y
    );
  }

  incrementScale() {
    return this.#CoordinateCalculator.incrementScale();
  }

  decrementScale() {
    return this.#CoordinateCalculator.decrementScale();
  }
}

export default CoordinateSystem;
