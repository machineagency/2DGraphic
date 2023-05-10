class PointData {
  points;
  intersections;
  #pointIdCounter = 1;
  constructor() {
    if (!PointData.instance) {
      PointData.instance = this;
      this.points = new Map();
      this.intersections = new Map();
    }
    return PointData.instance;
  }

  addPoint(srcP) {
    const key = this.#keyGen(srcP);
    if (this.points[key]) {
      this.points.get(key)[1] += 1;
    } else {
      this.points.set(key, [srcP, 1]);
    }
  }

  deletePoint(srcP) {
    const key = this.#keyGen(srcP);
    if (this.points.has(key)) {
      const [point, count] = this.points.get(key);
      if (count === 1) {
        this.points.delete(key);
      } else {
        this.points.set(key, [point, count - 1]);
      }
    }
  }

  addPointToIntersection(srcP) {
    const key = this.#keyGen(srcP);
    this.intersections.set(key, srcP);
  }

  #keyGen(srcP) {
    return srcP.id ? srcP.id : (srcP.id = `#${this.#pointIdCounter++}`);
  }
}

export default PointData;
