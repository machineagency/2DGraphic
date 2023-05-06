import CoordinateCalculator from "./CoordinateCalculator";
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
      (viewPoint.x - this.#p.view.center.x) / getScale(),
      (viewPoint.x - this.#p.view.center.y) / getScale()
    );
  }

  viewPoint(srcPoint) {
    return new this.#p.Point(
      srcPoint.x * getScale() + this.#p.view.center.x,
      srcPoint.x * getScale() + this.#p.view.center.y
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
