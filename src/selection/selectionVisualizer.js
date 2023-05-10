import SelectionDecorator from "./selectionDecorator.js";
import Selection from "./selection.js";

class SelectionVisualizer {
  #selection;
  #selDecor;
  constructor(p) {
    this.#selection = new Selection(p);
    this.#selDecor = new SelectionDecorator(p);
  }
  visualizeSelectionPoints() {
    let points = this.#selection.getSelectedPoint();
    points.forEach((p) => this.#selDecor.highlightPoint(p));
  }

  visualizeSelectionPaths() {
    let paths = this.#selection.getSelectedPath();
    paths.forEach((p) => this.#selDecor.highlightPath(p));
  }
}

export default SelectionVisualizer;
