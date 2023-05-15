import CoordinateSystem from "./coordinateSystem/CoordinateSystem.js";
import Style from "./StyleSheet.js";
import config from "./config.js";
import CompoundPath from "./compoundPath/CompoundPath.js";
import pointInventory from "./pointManager/pointInventory.js";

//ShapeInventory doesn't has to be a singleton class because non of its
//field actually allocated memory for storing data, both srcInv and viewInv
//are just the reference to the singleton
class ShapeInventory {
  #viewInv;
  #converter;
  #debug = true;
  #pointInv;
  #p;
  #countID = 1;
  constructor(p) {
    this.#p = p;
    this.#pointInv = new pointInventory(p);
    this.#converter = new CoordinateSystem(p);
    this.srcInv = p.project.activeLayer.children["src"].children;
    this.#viewInv = p.project.activeLayer.children["view"].children;
  }

  addItem(item) {
    if (item instanceof CompoundPath) {
      this.addCompundShape(item);
    } else if (item instanceof this.#p.Path) {
      this.addShape(item);
    } else {
      throw new Error("Invalid item type. Expected CompoundPath or Path.");
    }
  }

  deleteItem(item) {
    if (item instanceof CompoundPath) {
      this.deleteCompoundShape(item);
    } else if (item instanceof this.#p.Path) {
      this.deleteShape(item);
    } else {
      throw new Error("Invalid item type. Expected CompoundPath or Path.");
    }
  }

  addCompundShape(compPath) {
    console.log(compPath.paths);
    if (compPath instanceof CompoundPath) {
      compPath.paths.forEach((path) => {
        this.#addSrcChild(path);
        this.#addViewShape(path);
        this.#pointInv.addPath(path);
      });
    }
  }

  deleteCompoundShape(compPath) {
    if (compPath instanceof CompoundPath) {
      compPath.paths.forEach((path) => {
        this.deleteShape(path);
      });
    }
  }

  addShape(srcPath) {
    this.#addSrcChild(srcPath);
    this.#addViewShape(srcPath);
    this.#pointInv.addPath(srcPath);
  }

  deleteShape(srcPath) {
    this.#deleteViewAndSrc(srcPath);
    this.#pointInv.deletePath(srcPath);
  }

  #addSrcChild(srcPath) {
    if (!srcPath.name) srcPath.name = `#${this.#countID++}`;
    if (!srcPath.depth) srcPath.depth = 0;
    this.#p.project.activeLayer.children["src"].addChild(srcPath);
  }

  #addviewChild(viewPath) {
    this.#p.project.activeLayer.children["view"].addChild(viewPath);
  }

  #addViewShape(src) {
    let newPosition = this.#converter.viewPoint(src.position);
    let scale = this.#converter.getScale();
    let view = src.clone();
    view.position = newPosition;
    view.scale(scale, scale, newPosition);
    view.name = src.name;
    view.depth = src.depth;
    Style.viewShapeStyle(view);

    if (this.#viewInv[view.name]) {
      this.#viewInv[view.name].remove();
    }
    this.#addviewChild(view);
    return view;
  }

  #deleteViewAndSrc(src) {
    if (src) {
      if (this.#viewInv[src.name]) {
        this.#viewInv[src.name].remove();
      }
      src.remove();
    }
  }
}

export default ShapeInventory;
