import Util from "./Util";

class pointInventory {
  #points;
  #intersections;
  #u;
  #pointIdCounter;
  constructor(p) {
    this.#u = new Util(p);
    this.#points = new Map();
    this.#intersections = new Map();
    this.#pointIdCounter = 1;
  }

  get(srcPoint) {
    return this.#points.get(this.#keyGen(srcPoint))[0];
  }

  addPoint(srcP) {
    const key = this.#keyGen(srcP);
    if (this.#points.has(key)) {
      this.#points.get(key)[1] += 1;
    } else {
      this.#points.set(key, [point, 1]);
    }
  }

  deletePoint(srcP) {
    const key = this.#keyGen(srcP);
    if (this.#points.has(key)) {
      const [point, count] = this.#points.get(key);
      if (count === 1) {
        this.#points.delete(key);
      } else {
        this.#points.set(key, [point, count - 1]);
      }
    }
  }

  addPath(srcPath) {
    const processPath = (srcPath) => {
      path.segments.forEach((seg) => {
        this.addPoint(seg.point);
      });
      this.#u.view.kids.forEach((i) => this.#addIntersection(srcPath, i));
    };

    if (srcPath instanceof this.#u.p.CompoundPath) {
      srcPath.children.forEach(processPath);
    } else {
      processPath(srcPath);
    }
  }

  deletePath(srcPath, shouldRecalcIntersection = true) {
    const processPath = (path) => {
      path.segments.forEach((seg) => {
        this.deletePoint(seg.point);
      });
    };
    if (srcPath instanceof this.#u.p.CompoundPath) {
      srcPath.children.forEach(processPath);
    } else {
      processPath(srcPath);
    }
    if (shouldRecalcIntersection) {
      this.recalcIntersections();
    }
  }

  recalc() {
    this.recalcPoints();
    this.recalcIntersections();
  }

  recalcPoints() {
    var paths = this.#u.src.kids;
    this.#points = new Map();
    paths.forEach((path) => this.addPath(path));
  }

  recalcIntersections() {
    var paths = this.#u.src.kids;
    this.#intersections = new Map();
    for (let i = 0; i < paths.length; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        this.#addIntersection(paths[i], paths[j]);
      }
    }
  }

  getClosest(srcPoint) {
    var gridP, gridDis, existP, existDis;
    [gridP, gridDis] = this.#closeToGrid(srcPoint);
    [existP, existDis] = this.#closeToExistingPoint(srcPoint);
    var f = gridDis * 1.5 < existDis ? [gridP, gridDis] : [existP, existDis];
    return f[1] * this.#u.gridScale < 10 ? f[0] : null;
  }

  #keyGen(srcP) {
    return srcP.id ? srcP.id : this.#pointIdCounter++;
  }

  #addPointToIntersection(srcP) {
    const key = this.#keyGen(srcP);
    this.#intersections.set(key, point);
  }

  #addIntersection(path1, path2) {
    if (path1 !== path2) {
      var intersections = path1.getIntersections(path2);
      intersections.forEach((i) => this.#addPointToIntersection(i.point));
    }
  }

  //srcPoint is the mouse point
  #closeToExistingPoint(srcPoint) {
    var [minP1, dis1] = minPoint(srcPoint, this.#points);
    var [minP2, dis2] = minPoint(srcPoint, this.#intersections);
    return dis1 < dis2 ? [minP1, dis1] : [minP2, dis2];
  }

  // input p is srcPoint, only p to reduce length
  #closeToGrid(p) {
    var pointToSnap = new this.#u.Point(Math.round(p.x), Math.round(p.y));
    var srcDis = p.getDistance(pointToSnap) * this.#u.gridScale;
    return [srcPoint, srcDis];
  }
}

function minPoint(point, pointMap) {
  var minPoint = null;
  var minDis = 99999;
  pointMap.forEach((val, key) => {
    var val = Array.isArray(val) ? val[0] : val;
    if (point.getDistance(val) < minDis) {
      minDis = point.getDistance(val);
      minPoint = val;
    }
  });

  return [minPoint, minDis];
}
