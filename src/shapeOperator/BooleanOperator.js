import ShapeInventory from "../ShapeInventory.js";
import CompoundPath from "../compoundPath/CompoundPath.js";
import config from "../config.js";
class BooleanOperator {
  #p;
  constructor(p) {
    this.#p = p;
  }

  unite(path1, path2) {
    return this.#operatorFunctions("unite", path1, path2);
  }
  intersect(path1, path2) {
    return this.#operatorFunctions("intersect", path1, path2);
  }
  subtract(path1, path2) {
    return this.#operatorFunctions("subtract", path1, path2);
  }

  #operatorFunctions(op, path1, path2) {
    let inv = new ShapeInventory(this.#p);
    var res = this.#operatorOnTwoPaths(op, path1, path2, inv);

    if (
      (res instanceof this.#p.Path && res.segments.length > 0) ||
      Array.isArray(res)
    ) {
      return res;
    }
  }

  #operatorOnTwoPaths(op, path1, path2, inv) {
    // Check if both arguments are valid path instances
    if (!(path1 instanceof this.#p.Path) || !(path2 instanceof this.#p.Path)) {
      throw new Error("Both arguments must be instances of Path");
    }

    // Check depth of both paths
    let depth1 = path1.depth;
    let depth2 = path2.depth;

    // Perform operation on path1 and path2 based on their depths
    let result;

    if (Array.isArray[path1]) {
      if (Array.isArray[path2]) {
      } else {
      }
    } else {
      if (Array.isArray[path2]) {
      } else {
      }
    }

    if (depth1 === depth2) {
      result = path1[op](path2);
    } else {
      // Handle case when depth is different
      console.log(depth2);
      if (op === "subtract") {
        if (depth2 === 0) {
          result = path1.subtract(path2);
          result = AfterOperationPathProcessor(result, this.#p, depth1);
        } else {
          // Subtract as 2D first
          let subtracted = path1.subtract(path2);
          subtracted = AfterOperationPathProcessor(subtracted, this.#p, depth1);
          // Add intersection back with depth == depth1 - depth2
          let intersection = path1.intersect(path2);

          intersection = AfterOperationPathProcessor(
            intersection,
            this.#p,
            depth2
          );
          result = [...subtracted, ...intersection];
        }
      } else if (op === "unite") {
        // Determine the path with smaller depth
        let lowerDepthPath = depth1 < depth2 ? path1 : path2;
        let higherDepthPath = depth1 < depth2 ? path2 : path1;

        // Subtract the lower depth path from the higher depth path
        let subtracted = higherDepthPath.subtract(lowerDepthPath);
        subtracted = AfterOperationPathProcessor(
          subtracted,
          this.#p,
          higherDepthPath.depth
        );

        result = [...subtracted, lowerDepthPath];
      }
    }

    // Remove the original paths
    inv.deleteItem(path1);
    inv.deleteItem(path2);
    // Return the result
    return result;
  }
}

function array1SubtractPath2(array1, path2, p) {
  inter = [];
  array1.forEach((path1) => {
    let [subtract, intersection] = path1subtractPath2(path1, path2, p);
    inter.push(...intersection);
  });
  let finalIntersection;
  for (let i = 0; i < inter.length - 1; i++) {
    let temp = inter[i].intersect(inter[i + 1]);
    finalIntersection = inter[i].intersect(inter[i + 1]);
    temp.remove();
  }
  return [...subtract, finalIntersection];
}

function path1subtractPath2(path1, path2, p) {
  let depth1 = path1.depth;
  let depth2 = path2.depth;
  if (depth2 === 0) {
    result = path1.subtract(path2);
    result.depth = 0;
  } else {
    // Subtract as 2D first
    let subtracted = path1.subtract(path2);
    subtracted = AfterOperationPathProcessor(subtracted, p, depth1);
    // Add intersection back with depth == depth1 - depth2
    let intersection = path1.intersect(path2);

    intersection = AfterOperationPathProcessor(intersection, p, depth2);
    return [[...subtracted], [...intersection]];
  }
}

function AfterOperationPathProcessor(path, p, depth) {
  let res = [];
  if (path instanceof p.CompoundPath) {
    path = path.children;
    path.forEach((element, i) => {
      let name = Date.now() + i;
      element.name = `#${name}`;
      element.depth = depth;
      res.push(element);
    });
  } else {
    path.depth = depth;
    res = [path];
  }

  return res;
}

export default BooleanOperator;
