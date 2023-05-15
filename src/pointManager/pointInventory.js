import PointData from "./pointData.js";
import Util from "../util.js";
class PointInventory {
  #pd;
  #p;
  constructor(p) {
    this.#p = p;
    this.#pd = new PointData();
  }

  getPoints() {
    return this.#pd.points;
  }

  getIntersections() {
    return this.#pd.intersections;
  }

  addPoint(srcP) {
    this.#pd.addPoint(srcP);
  }

  deletePoint(srcP) {
    this.#pd.deletePoint(srcP);
  }

  addPath(srcPath) {
    const processPath = (path) => {
      path.segments.forEach((seg) => {
        this.addPoint(seg.point);
      });
      Util.src(this.#p).forEach((i) => this.#addIntersection(path, i));
    };

    if (srcPath.children) {
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
    if (srcPath.children) {
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
    var paths = Util.src(this.#p);
    this.#pd.points = new Map();
    paths.forEach((path) => this.addPath(path));
  }

  recalcIntersections() {
    var paths = Util.src(this.#p);
    this.#pd.intersections = new Map();
    for (let i = 0; i < paths.length; i++) {
      for (let j = i + 1; j < paths.length; j++) {
        this.#addIntersection(paths[i], paths[j]);
      }
    }
  }

  //get the closest point from input point. input is srcPoint.
  getClosest(srcPoint) {
    var gridP, gridDis, existP, existDis;
    [gridP, gridDis] = this.#closeToGrid(srcPoint);
    [existP, existDis] = this.#closeToExistingPoint(srcPoint);
    var f = gridDis * 1.5 < existDis ? [gridP, gridDis] : [existP, existDis];
    return f[0];
    // after the exporting, remember to check if the number if less than some
    // visual distances... if it is zoom in 100x, length of 0.5 * 100 = 50 doesn't
    // really make any sense.
  }

  #addIntersection(path1, path2) {
    if (path1 !== path2) {
      const getPaths = (path) => {
        if (path instanceof this.#p.CompoundPath) {
          // Return all children of the compound path
          return path.children;
        }
        return [path];
      };

      const paths1 = getPaths(path1);
      const paths2 = getPaths(path2);

      // Check intersections between all pairs of paths
      for (const p1 of paths1) {
        for (const p2 of paths2) {
          const intersections = p1.getIntersections(p2);
          intersections.forEach((i) =>
            this.#pd.addPointToIntersection(i.point)
          );
        }
      }
    }
  }

  //srcPoint is the mouse point
  #closeToExistingPoint(srcPoint) {
    var [minP1, dis1] = minPoint(srcPoint, this.#pd.points);
    var [minP2, dis2] = minPoint(srcPoint, this.#pd.intersections);
    return dis1 < dis2 ? [minP1, dis1] : [minP2, dis2];
  }

  // input p is srcPoint, only p to reduce length
  #closeToGrid(point) {
    var pointToSnap = new this.#p.Point(
      Math.round(point.x),
      Math.round(point.y)
    );
    var srcDis = point.getDistance(pointToSnap);
    return [point, srcDis];
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

export default PointInventory;
