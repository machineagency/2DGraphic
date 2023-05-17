import CompoundPath from "../compoundPath/CompoundPath.js";
import ExportPathVisualizer from "./ExportPathVisualizer.js";

class PathExporter {
  #p;
  constructor(p) {
    this.#p = p;
  }

  // Export item based on its type (CompoundPath or Path)
  export(item) {
    let exportResult;

    if (Array.isArray(item)) {
      exportResult = [];
      item.forEach((path) => {
        exportResult.push(this.exportPath(path));
      });
    } else if (item instanceof this.#p.Path) {
      exportResult = [this.exportPath(item)];
    } else {
      throw new Error("Invalid item type. Expected CompoundPath or Path.");
    }

    let displayer = new ExportPathVisualizer(this.#p);
    displayer.displayExport(exportResult);
    return exportResult;
  }

  // Export a single path, creating contours
  exportPath(path, distance = 0.1, minArea = 0.1) {
    let contours = [];
    let currentPath = path.clone();
    currentPath.depth = path.depth;

    let originalPath = this.#copyOuterContourPath(path);
    // Add the modified original path to the contours array
    contours.push(originalPath);

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
      for (let i = distance / 2; i < currentPath.length; i += 0.03) {
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

      // Get all paths with the same winding as the original path
      // splitPaths.push(pa);
      // let pathsWithCorrectWinding = splitPaths.filter(
      //   (currentPath) => currentPath.clockwise === path.clockwise
      // );

      // let stop = false;
      // pathsWithCorrectWinding.forEach((newPath) => {
      //   newPath.closed = true;
      //   newPath.depth = currentPath.depth;
      //   if (
      //     Math.abs(newPath.area) > Math.abs(oldarea) ||
      //     newPath.getIntersections(currentPath).length > 0
      //   ) {
      //     stop = true;
      //   } else {
      //     contours.push(newPath);
      //   }
      // });

      // should turn this into recursion!!!

      newPath.closed = true;
      newPath.depth = currentPath.depth;

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

  #copyOuterContourPath(path) {
    let originalPath = new this.#p.Path();
    for (let i = 0; i <= path.length; i += 0.02) {
      originalPath.add(path.getPointAt(i));
    }
    originalPath.closed = true;
    originalPath.depth = path.depth;
    return originalPath;
  }
}

export default PathExporter;
