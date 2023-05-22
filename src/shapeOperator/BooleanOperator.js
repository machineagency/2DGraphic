import ShapeInventory from "../ShapeInventory.js";
import CompoundPath from "../compoundPath/CompoundPath.js";
import config from "../config.js";
class BooleanOperator {
  #p;
  constructor(p) {
    this.#p = p;
  }

  // unite(path1, path2) {

  // }
  // intersect(path1, path2) {

  // }
  subtract(path1, path2) {
    let inv = new ShapeInventory(this.#p);
    return this.#subtractHelper(path1, path2, inv);
  }

  #subtractHelper(path1, path2, inv) {
    // Check depth of both paths

    // Perform operation on path1 and path2 based on their depths
    let result;

    if (Array.isArray(path1)) {
      if (Array.isArray(path2)) {
      } else {
        result = array1SubtractPath2(path1, path2, this.#p);
      }
    } else {
      if (Array.isArray(path2)) {
      } else {
        result = path1subtractPath2(path1, path2, this.#p);
      }
    }

    // Remove the original paths
    inv.deleteItem(path1);
    inv.deleteItem(path2);
    // Return the result
    return result;
  }
}

function Array1SubtractArray2() {}

function path1SubtractArray2() {}

//array1 subtract path2 + union(array1 intersect path2)
function array1SubtractPath2(array1, path2, p) {
  let inter = [];
  let sub = [];
  array1.forEach((path1) => {
    let res = path1subtractPath2(path1, path2, p);
    res.forEach((resItem) => {
      if (resItem instanceof p.CompoundPath) {
        sub.push(resItem);
      } else if (resItem instanceof p.Path) {
        sub.push(...resItem[0]);
        inter.push(...resItem[1]);
      }
    });
  });
  let finalIntersection;
  for (let i = 0; i < inter.length - 1; i++) {
    let temp = inter[i].intersect(inter[i + 1]);
    let finalIntersection = inter[i].intersect(inter[i + 1]);
    temp.remove();
  }
  if (finalIntersection) {
    return [[finalIntersection], [...sub]];
  } else {
    return sub;
  }
}

function path1subtractPath2(path1, path2, p) {
  let depth1 = path1.depth;
  let depth2 = path2.depth;
  let result;
  if (depth2 <= depth1) {
    result = path1.subtract(path2);
    result.depth = depth1;
    return [result];
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
