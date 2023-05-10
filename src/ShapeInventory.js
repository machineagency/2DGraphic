import CoordinateSystem from "./coordinateSystem/CoordinateSystem.js";
import Style from "./StyleSheet.js";
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
  constructor(p) {
    this.#p = p;
    this.#pointInv = new pointInventory(p);
    this.#converter = new CoordinateSystem(p);
    this.srcInv = p.project.activeLayer.children["src"].children;
    this.#viewInv = p.project.activeLayer.children["view"].children;
  }

  addShape(srcPath) {
    if (this.#debug) {
      if (
        !(
          srcPath instanceof this.#p.Path ||
          srcPath instanceof this.#p.CompoundPath
        )
      ) {
        alert(
          "can not add the input, input is neither a path or compound path"
        );
      }
    }
    this.#addSrcChild(srcPath);
    this.#addViewShape(srcPath);
    this.#pointInv.addPath(srcPath);
  }

  deleteShape(srcPath) {
    if (this.#debug) {
      if (
        !(
          srcPath instanceof this.#p.Path ||
          srcPath instanceof this.#p.CompoundPath
        )
      ) {
        alert(
          "can not delete the input, input is neithher a path nor compound path"
        );
      }
    }

    this.#deleteViewAndSrc(srcPath);
    this.#pointInv.deletePath(srcPath);
  }

  #addSrcChild(srcPath) {
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
