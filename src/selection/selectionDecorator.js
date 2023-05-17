import Style from "../StyleSheet.js";
import Util from "../Util.js";
import CoordinateSystem from "../coordinateSystem/CoordinateSystem.js";
import DecorManager from "../decorManager.js";
// make sure the visualizer should have a name;
class SelectionDecorator {
  #p;
  #decor;
  #cordSys;
  constructor(p) {
    this.#p = p;
    this.#decor = new DecorManager(p);
    this.#cordSys = new CoordinateSystem(p);
  }

  highlightPoint(srcPoint) {
    let viewPoint = this.#cordSys.viewPoint(srcPoint);
    let tempPoint = new this.#p.Path.Circle(viewPoint, 2);
    tempPoint.style = Style.selection.pointHighlight;
    tempPoint.name = srcPoint.id;
    this.#decor.add(tempPoint);
  }

  highlightPath(srcPath) {
    let viewPath = Util.view(this.#p)[srcPath.name].clone();
    viewPath.fullySelected = true;
    this.#decor.add(viewPath);
  }
}

export default SelectionDecorator;
