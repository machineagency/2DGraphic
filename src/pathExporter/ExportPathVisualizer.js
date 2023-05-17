import CoordinateSystem from "../coordinateSystem/CoordinateSystem.js";
import Style from "../StyleSheet.js";

class ExportPathVisualizer {
  #viewInv;
  #converter;
  #p;
  #expInv;
  constructor(p) {
    this.#p = p;
    this.#converter = new CoordinateSystem(p);
    this.#expInv = p.project.activeLayer.children["export"].children;
  }

  displayExport(contours) {
    contours.forEach((contour) => {
      contour.forEach((path) => {
        this.#addShape(path);
      });
    });
  }

  turnOffDisplay() {
    this.#expInv.forEach((item) => item.remove());
  }

  #addShape(srcPath) {
    this.#addExportShape(srcPath);
  }

  #addExportChild(viewPath) {
    this.#p.project.activeLayer.children["export"].addChild(viewPath);
  }

  #addExportShape(src) {
    let newPosition = this.#converter.viewPoint(src.position);
    let scale = this.#converter.getScale();
    let view = src.clone();
    view.position = newPosition;
    view.scale(scale, scale, newPosition);
    view.name = src.name;
    view.depth = src.depth;
    Style.viewExportStyle(view);

    if (view.name) {
      if (this.#viewInv[view.name]) {
        this.#viewInv[view.name].remove();
      }
    }

    this.#addExportChild(view);
    return view;
  }
}
export default ExportPathVisualizer;
