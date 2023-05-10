import PointInventory from "./pointInventory";

class PointExporter {
  constructor(p) {
    this.pInv = new PointInventory(p);
  }

  getPoints() {
    this.pInv.getPoints();
  }

  getIntersections() {
    this.pInv.recalcIntersections();
    this.pInv.getIntersections();
  }

  getPointsFromPath(path) {
    path.segments.forEach((seg) => seg.point);
  }

  getClosest(point) {
    this.pInv.getClosest(point);
  }
}

export default PointExporter;
