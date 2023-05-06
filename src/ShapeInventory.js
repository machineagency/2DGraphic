import CoordinateSystem from "./CoordinateSystem/CoordinateSystem";
import Style from "./StyleSheet";

class ShapeInventory {
  #viewInv;
  #converter;
  #debug = true;
  #p;
  constructor(p) {
    this.#p = p;
    this.#converter = new CoordinateSystem(p);
    this.srcInv = p.project.activeLayer.children["src"].children;
    this.viewInv = p.project.activeLayer.children["view"].children;
  }

  addShape(srcPath) {
    if (debug) {
      if (
        !(srcPath instanceof this.#p.Path) ||
        !(srcPath instanceof this.#p.CompoundPath)
      ) {
        alert(
          "can not add the input, input is neither a path or compound path"
        );
      }
    }

    this.srcInv.addChild(src);
    this.#addViewShape(srcPath);
  }

  deleteShape(srcPath) {
    if (debug) {
      if (
        !(srcPath instanceof this.#p.Path) ||
        !(srcPath instanceof this.#p.CompoundPath)
      ) {
        alert(
          "can not delete the input, input is neithher a path nor compound path"
        );
      }
    }
    this.#deleteViewAndSrc(srcPath);
  }

  #addViewShape(srcPath) {
    let newPosition = this.#converter.viewPoint(src.position);
    let scale = this.#converter.getScale();
    let view = src.clone();
    view.position = newPosition;
    view.scale(scale, scale, newPosition);
    view.name = src.name;
    view.style = Style.viewShapeStyle;

    if (this.#viewInv[view.name]) {
      this.#viewInv[view.name].remove();
    }
    this.#viewInv.addChild(view);
    return view;
  }

  #deleteViewAndSrc(src) {
    if (src) {
      if (this.#viewInv[src.name]) {
        this.#viewInv[src.name].remove;
      }
      src.remove();
    }
  }
}

export default ShapeInventory;
