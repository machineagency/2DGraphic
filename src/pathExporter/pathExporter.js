import CompoundPath from "../compoundPath/CompoundPath.js";
import ExportPathVisualizer from "./ExportPathVisualizer.js";

class PathExporter {
  #p;
  #contour = [];
  constructor(p) {
    this.#p = p;
  }

  // Export item based on its type (CompoundPath or Path)
  export(item) {
    let exportResult;

    // Add the modified original path to the contours array
    this.#copyOuterContourPath(item);

    if (Array.isArray(item)) {
      exportResult = [];
      item.forEach((path) => {
        if (path instanceof this.#p.CompoundPath) {
          exportResult.push(this.#exportCompoundPath(path));
        } else {
          exportResult.push(this.#exportPath2(path));
        }
      });
    } else if (item instanceof this.#p.Path) {
      exportResult = [this.#exportPath2(item)];
    } else if (item instanceof this.#p.CompoundPath) {
      exportResult = [this.#exportCompoundPath(item)];
    } else {
      throw new Error(
        "Invalid item type. Expected Array, CompoundPath or Path."
      );
    }

    let displayer = new ExportPathVisualizer(this.#p);
    displayer.displayExport(exportResult);

    return exportResult;
  }

  #exportCompoundPath(item) {
    //largest bounding box area child;
    let outerContour = item.children.reduce((largestPath, currentPath) => {
      return currentPath.bounds.area > largestPath.bounds.area
        ? currentPath
        : largestPath;
    });

    //the rest of child;
    let holes = item.children.filter((path) => path !== outerContour);

    // here we want to this create a think fissure between the hole and the
    // contour, such that the compoundPath is now a Path. Since the fisure is so
    // small, when cut by milling machine, it still retain the shape of compound Shape
    // once we have the path, we can treat it as a normal path and export inner contour lines
    let itemToExport = item.clone();
    holes.forEach((hole) => {
      let [nearestPoint, nearestHolePoint] = this.#getNearestPointFromHole(
        hole,
        outerContour
      );

      let fissureLine = new this.#p.Path.Line(nearestHolePoint, nearestPoint);
      let offsetDistance = 0.0001; // Adjust as needed for the size of the fissure
      let fissureBox = fissureLine.bounds.expand(offsetDistance);
      let fissurePath = new this.#p.Path.Rectangle(fissureBox);
      fissurePath.scale(1.02);

      // Subtract this path from the item to create the fissure
      let temp = itemToExport;
      itemToExport = itemToExport.subtract(fissurePath);
      temp.remove();
    });
    //once we turn the compoundShape to a path, we just use standard export
    let exportResult = this.#exportPath2(itemToExport);
    return exportResult;
  }

  #exportPath2(path, distance = 0.1, minArea = 0.1) {
    let currentPath = path.clone();
    currentPath.depth = path.depth;

    let oldarea = Math.abs(path.area);
    this.#addPathRec(path, currentPath, oldarea, this.#contour);
    return this.#contour;
  }

  #addPathRec(
    path,
    currentPath,
    oldarea,
    contours,
    distance = 0.1,
    minArea = 0.1
  ) {
    let pa = new this.#p.Path();
    let splitPaths = [];

    let normal = currentPath.getNormalAt(distance / 4);

    if (currentPath.clockwise) {
      normal = normal.negate();
    }
    pa.add(currentPath.getPointAt(distance / 4).add(normal.multiply(distance)));

    for (let i = distance / 2; i < currentPath.length; i += 0.03) {
      let point = currentPath.getPointAt(i);
      let normal = currentPath.getNormalAt(i);
      if (currentPath.clockwise) {
        normal = normal.negate();
      }

      let pointToAdd = point.add(normal.multiply(distance));
      let pathToCheck = new this.#p.Path.Line(pa.lastSegment.point, pointToAdd);
      let intersections = pa.getIntersections(pathToCheck);

      // Split path at intersection if there's more than one intersection
      if (intersections.length > 1) {
        splitPaths.push(pa.splitAt(intersections[0]));
      }

      pa.add(pointToAdd);
    }

    // Get all paths with the same winding as the original path
    splitPaths.push(pa);

    let pathsWithCorrectWinding = splitPaths.filter(
      (currentPath) =>
        currentPath.clockwise === path.clockwise &&
        Math.abs(currentPath.area) > 0.01
    );
    pathsWithCorrectWinding.forEach((newPath) => {
      if (
        Math.abs(newPath.area) > Math.abs(oldarea) ||
        newPath.getIntersections(currentPath).length > 0
      ) {
      } else {
        newPath.depth = currentPath.depth;
        newPath.closed = true;
        contours.push(newPath);
        currentPath = newPath;
        this.#addPathRec(path, currentPath, newPath.area, contours);
      }
    });
  }

  #copyOuterContourPath(path) {
    let originalPath;
    if (path instanceof this.#p.Path) {
      originalPath = new this.#p.Path();
      for (let i = 0; i <= path.length; i += 0.02) {
        originalPath.add(path.getPointAt(i));
      }
      originalPath.closed = true;
      originalPath.depth = path.depth;
      this.#contour.push(originalPath);
    } else if (path instanceof this.#p.CompoundPath) {
      path.children.forEach((childPath) => {
        let copiedChild = new this.#p.Path();
        for (let i = 0; i <= childPath.length; i += 0.02) {
          copiedChild.add(childPath.getPointAt(i));
        }
        copiedChild.closed = true;
        copiedChild.depth = childPath.depth;
        this.#contour.push(copiedChild);
      });
    }
  }

  #getNearestPointFromHole(hole, outerContour) {
    let closestDistance = Infinity;
    let nearestPoint;
    let nearestHolePoint;
    hole.segments.forEach((segment) => {
      let point = segment.point;
      let potentialNearestPoint = outerContour.getNearestPoint(point);
      let distance = potentialNearestPoint.getDistance(point);

      if (distance < closestDistance) {
        closestDistance = distance;
        nearestHolePoint = point;
        nearestPoint = potentialNearestPoint;
      }
    });
    return [nearestPoint, nearestHolePoint];
  }
}

export default PathExporter;

// Old Code
//  // Export a single path, creating contours
//  exportPath(path, distance = 0.1, minArea = 0.1) {
//   let contours = [];
//   let currentPath = path.clone();
//   currentPath.depth = path.depth;

//   let originalPath = this.#copyOuterContourPath(path);
//   // Add the modified original path to the contours array
//   contours.push(originalPath);

//   let oldarea = Math.abs(path.area);

//   while (Math.abs(currentPath.area) > minArea) {
//     // Initialize new path and array for split paths
//     let pa = new this.#p.Path();
//     let splitPaths = [];

//     // Calculate the first point and add to path
//     let normal = currentPath.getNormalAt(distance / 4);
//     if (path.clockwise) {
//       normal = normal.negate();
//     }
//     pa.add(
//       currentPath.getPointAt(distance / 4).add(normal.multiply(distance))
//     );

//     // Loop through remaining points on the path
//     for (let i = distance / 2; i < currentPath.length; i += 0.03) {
//       let point = currentPath.getPointAt(i);
//       let normal = currentPath.getNormalAt(i);
//       if (path.clockwise) {
//         normal = normal.negate();
//       }

//       let pointToAdd = point.add(normal.multiply(distance));
//       let pathToCheck = new this.#p.Path.Line(
//         pa.lastSegment.point,
//         pointToAdd
//       );
//       let intersections = pa.getIntersections(pathToCheck);

//       // Split path at intersection if there's more than one intersection
//       if (intersections.length > 1) {
//         splitPaths.push(pa.splitAt(intersections[0]));
//       }

//       pa.add(pointToAdd);
//     }

//     // Determine the largest area among the split paths
//     let newPath = splitPaths.reduce((largestPath, currentPath) => {
//       return Math.abs(currentPath.area) > Math.abs(largestPath.area)
//         ? currentPath
//         : largestPath;
//     }, pa);

//     newPath.closed = true;
//     newPath.depth = currentPath.depth;

//     // Break if the area of the new path is greater than the old one, or if it intersects with the current path
//     if (
//       Math.abs(newPath.area) > Math.abs(oldarea) ||
//       newPath.getIntersections(currentPath).length > 0
//     ) {
//       break;
//     }

//     // Update old area, add new path to contours, and set it as the current path
//     oldarea = newPath.area;
//     contours.push(newPath);
//     currentPath = newPath;
//   }

//   // Return the contours of the path
//   // console.log(contours);
//   return contours;
// }
