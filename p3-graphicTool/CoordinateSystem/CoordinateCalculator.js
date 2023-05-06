// CoordinateData.js
class CoordinateCalculator {
  #defaultSize = 40;
  #scale = 6;
  #scaleFactor = 5;

  constructor() {
    if (!CoordinateCalculator.instance) {
      CoordinateCalculator.instance = this;
    }
    return CoordinateCalculator.instance;
  }

  get() {
    return this.#defaultSize + this.#scale * this.#scaleFactor;
  }

  incrementScale() {
    this.#scale++;
    return this.get();
  }

  decrementScale() {
    this.#scale--;
    return this.get();
  }
}

export default CoordinateCalculator;
