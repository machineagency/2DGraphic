import ShapeInventory from "../ShapeInventory.js";
import CompoundPath from "../compoundPath/CompoundPath.js";
import config from "../config.js";

class BooleanCutter {
  #p;
  constructor(p) {
    this.#p = p;
  }

  cut(path1, path2) {
    let inv = new ShapeInventory(this.#p);
    return this.#cutHelper(path1, path2, inv);
  }

  //returning the result
  //result must be an array, where each entry is it's components
  #cutHelper(path1, path2, inv) {
    let result;
    if (Array.isArray(path1)) {
      if (Array.isArray(path2)) {
      } else {
        let preresult = array1CutPath2(path1, path2, this.#p);
        result = [...preresult[0], ...preresult[1]];
      }
    } else {
      if (Array.isArray(path2)) {
      } else {
        let preresult = path1CutPath2(path1, path2, this.#p);
        result = [...preresult[0], ...preresult[1]];
      }
    }

    // Remove the original paths
    inv.deleteItem(path1);
    inv.deleteItem(path2);
    // Return the result
    return result;
  }
}

function array1CutPath2(array1, path2, p) {
  let inter = [];
  let sub = [];
  array1.forEach((path1) => {
    let res = path1CutPath2(path1, path2, p);
    if (res) {
      // path1 cut path2 is successful
      let [subtr, intersec] = res;
      subtr.forEach((resItem) => {
        if (resItem instanceof p.CompoundPath || resItem instanceof p.Path) {
          sub.push(resItem);
        }
      });

      intersec.forEach((resItem) => {
        if (resItem instanceof p.CompoundPath || resItem instanceof p.Path) {
          inter.push(resItem);
        }
      });
    } else {
      // path1 cut path2 is unsuccessful
      sub.push(path1);
    }
  });

  let finalIntersection;
  if (inter.length > 0) {
    finalIntersection = inter[0];
  }
  for (let i = 0; i < inter.length - 1; i++) {
    let temp = inter[i].intersect(inter[i + 1]);
    finalIntersection = inter[i].intersect(inter[i + 1]);
    temp.remove();
  }

  if (finalIntersection) {
    return [[finalIntersection], [...sub]];
  } else {
    return [[], [...sub]];
  }
}

function path1CutPath2(path1, path2, p) {
  let depth1 = config.canvas.depth - path1.height;
  let depth2 = path2.depth;
  let height1 = path1.height;
  let height2 = config.canvas.depth - path2.depth;
  let result;
  if (depth2 === config.canvas.depth) {
    result = path1.subtract(path2);
    result.height = height1;
    return [[result], []];
  } else {
    // Subtract as 2D first
    if (depth2 >= depth1) {
      let subtracted = path1.subtract(path2);
      subtracted = postProcessCut(subtracted, p, path1.height);
      // Add intersection back with depth == depth1 - depth2
      let intersection = path1.intersect(path2);
      if (intersection.segments.length === 0) {
        // return [[...subtracted], []];
        // or we can return nothing and caller will treat undefine as unsuccessful;
      } else {
        intersection = postProcessCut(intersection, p, height2);
        return [[...subtracted], [...intersection]];
      }
    } else {
      console.log("nothing has been cut");
    }
  }
}

//preconditions:
//  path may be Path or CompoundPath
//      if compoundPath:
//         it can be hole like;
//         it can also be multiple pieces which children.length > 1;
//         it can have both hole and multiple pieces;
//
//      if path: then go next step;
//processing abstract for reference:
//   if CompoundPath:
//      if has hole:
//          compoundPath.height =  height
//          compoundPath.name = UniqueID
//          return the compound path as it is,
//
//      if multiple pieces:
//          for Each pieces:
//              piece.height = height
//              piece.name = UniqueID
//              array.push(piece)
//          return the array
//
//       if both hole and multiple pieces:
//          figure out which piece has hole, hole does not contribute to separate piece:
//              1. perhaps hole piece is itself a compoundPath,
//          then for each piece:
//              piece.height = height
//              piece.name = UniqueID
//              array.push(piece)
//          return the array
//    if Path:
//      path.height = height
//      return [path];
//post condition:
//  return array of mix of Path and CompoundPath:
//         array may not be empty
//         entry of array may only be CompoundPath or Path
//           if entry is Compoundpath, it's children may only be hole, and not be multiple pieces
//         each entry must has the height property assigned

function postProcessCut(path, p, height) {
  let res = [];

  if (path instanceof p.CompoundPath) {
    // Check if the compound path has a hole
    let hasHole = path.children.some((child) => child.isClockwise() === false);

    // If compound path has a hole, we consider it as a single entity
    if (hasHole) {
      path.height = height;
      path.name = `#${Date.now()}`;
      return [path];
    }
    // If compound path doesn't have a hole, we treat each child as an individual piece
    else {
      path.children.forEach((element, i) => {
        let name = Date.now() + i;
        element.name = `#${name}`;
        element.height = height;
        res.push(element);
      });
    }
  } else {
    path.height = height;
    path.name = `#${Date.now()}`;
    res = [path];
  }

  return res;
}

export default BooleanCutter;
