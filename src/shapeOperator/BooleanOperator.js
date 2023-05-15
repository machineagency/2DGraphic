import ShapeInventory from "../ShapeInventory.js";
import CompoundPath from "../compoundPath/CompoundPath.js";
import config from "../config.js";
class BooleanOperator {
  #p;
  constructor(p) {
    this.#p = p;
  }

  unite(paths) {
    return this.#operatorFunctions("unite", paths);
  }
  intersect(paths) {
    return this.#operatorFunctions("intersect", paths);
  }
  subtract(paths) {
    return this.#operatorFunctions("subtract", paths);
  }

  #operatorFunctions(op, paths) {
    let inv = new ShapeInventory(this.#p);
    if (paths.length === 2) {
      var res = this.#operatorOnTwoPaths(op, paths[0], paths[1], inv);
    }

    console.log(res);
    if (
      (res instanceof this.#p.Path && res.segments.length > 0) ||
      (res instanceof this.#p.CompoundPath && res.children.length > 0)
    ) {
      inv.addShape(res);
    } else if (res instanceof CompoundPath) {
      inv.addCompundShape(res);
      return res;
    }
  }

  #operatorOnTwoPaths(op, path1, path2, inv) {
    // Check if both arguments are valid path instances
    let comp = new CompoundPath(this.#p);
    if (!(path1 instanceof this.#p.Path) || !(path2 instanceof this.#p.Path)) {
      throw new Error("Both arguments must be instances of Path");
    }

    // Check depth of both paths
    let depth1 = path1.depth;
    let depth2 = path2.depth;

    // Perform operation on path1 and path2 based on their depths
    let result;
    if (depth1 === depth2) {
      result = path1[op](path2);
    } else {
      // Handle case when depth is different
      if (op === "subtract") {
        if (depth2 >= config.canvas.depth) {
          result = path1.subtract(path2);
          result.depth = 0;
        } else {
          // Subtract as 2D first
          let subtracted = path1.subtract(path2);
          subtracted.depth = depth1;
          subtracted.name = `#${Date.now()}`;
          // Add intersection back with depth == depth1 - depth2
          let intersection = path1.intersect(path2);
          intersection.depth = depth2;
          intersection.name = `#${Date.now() + 1}`;
          comp.add(subtracted);
          comp.add(intersection);
          result = comp;
        }
      } else {
        comp.add(path1);
        comp.add(path2);
        result = comp;
      }
    }

    // Remove the original paths
    inv.deleteShape(path1);
    inv.deleteShape(path2);
    // Return the result
    return result;
  }
}

export default BooleanOperator;
