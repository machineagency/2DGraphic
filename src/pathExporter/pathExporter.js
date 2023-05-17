import ShapeInventory from "../ShapeInventory.js";
import CompoundPath from "../compoundPath/CompoundPath.js";

class PathExporter {
  #p;
  constructor(p) {
    this.#p = p;
  }

  // Export item based on its type (CompoundPath or Path)
  export(item) {
    if (item instanceof CompoundPath) {
      return item.paths.map((path) => this.exportPath(path));
    } else if (item instanceof this.#p.Path) {
      return this.exportPath(item);
    } else {
      throw new Error("Invalid item type. Expected CompoundPath or Path.");
    }
  }

  // Export a single path, creating contours
  exportPath(path, distance = 0.1, minArea = 0.1) {
    let contours = [];
    let currentPath = path.clone();
    let oldarea = Math.abs(path.area);

    while (Math.abs(currentPath.area) > minArea) {
      // Initialize new path and array for split paths
      let pa = new this.#p.Path();
      let splitPaths = [];

      // Calculate the first point and add to path
      let normal = currentPath.getNormalAt(distance / 4);
      if (path.clockwise) {
        normal = normal.negate();
      }
      pa.add(
        currentPath.getPointAt(distance / 4).add(normal.multiply(distance))
      );

      // Loop through remaining points on the path
      for (let i = distance / 2; i < currentPath.length; i += 0.02) {
        let point = currentPath.getPointAt(i);
        let normal = currentPath.getNormalAt(i);
        if (path.clockwise) {
          normal = normal.negate();
        }

        let pointToAdd = point.add(normal.multiply(distance));
        let pathToCheck = new this.#p.Path.Line(
          pa.lastSegment.point,
          pointToAdd
        );
        let intersections = pa.getIntersections(pathToCheck);

        // Split path at intersection if there's more than one intersection
        if (intersections.length > 1) {
          splitPaths.push(pa.splitAt(intersections[0]));
        }

        pa.add(pointToAdd);
      }

      // Determine the largest area among the split paths
      let newPath = splitPaths.reduce((largestPath, currentPath) => {
        return Math.abs(currentPath.area) > Math.abs(largestPath.area)
          ? currentPath
          : largestPath;
      }, pa);

      newPath.closed = true;

      // Break if the area of the new path is greater than the old one, or if it intersects with the current path
      if (
        Math.abs(newPath.area) > Math.abs(oldarea) ||
        newPath.getIntersections(currentPath).length > 0
      ) {
        break;
      }

      // Update old area, add new path to contours, and set it as the current path
      oldarea = newPath.area;
      contours.push(newPath);
      currentPath = newPath;
    }

    // Return the contours of the path
    return contours;
  }
}

function to360(angle) {
  return Math.abs(angle + 360) % 360;
}

function minPoint(point, pointMap) {
  var minPoint = null;
  var minDis = 99999;
  var index = -1;
  pointMap.forEach((val, i) => {
    if (point.getDistance(val) < minDis) {
      minDis = point.getDistance(val);
      minPoint = val;
      index = i;
    }
  });

  return [minPoint, minDis, index];
}

export default PathExporter;
