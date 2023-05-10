//we assume all path has a unique name, all segment and point has a unique id;
//we also assume all path, segment, and point are in world coordinate include input;
class Selection {
  #pointSelection = new Map();
  #segmentSelection = new Map();
  #pathSelection = new Map();

  constructor(p) {
    if (!Selection.instance) {
      Selection.instance = this;
    }
    return Selection.instance;
  }

  getSelection() {
    return {
      points: this.#pointSelection,
      segments: this.#segmentSelection,
      paths: this.#pathSelection,
    };
  }

  getSelectedPoint() {
    return this.#pointSelection;
  }

  getSelectedPath() {
    return this.#pathSelection;
  }

  getSelectedSegment() {
    return this.#segmentSelection;
  }

  addPath(path) {
    this.#pathSelection.set(path.name, path);
  }

  deletePath(path) {
    this.#pathSelection.delete(path.name);
  }

  addSegment(seg) {
    seg.selection = true;
    //I don't know how seg will be presented yet...
    this.#segmentSelection.set(seg.id, seg);
  }

  deleteSegment(seg) {
    this.#segmentSelection.delete(seg.id);
  }

  addPoint(point) {
    this.#pointSelection.set(point.id, point);
  }

  deletePoint(point) {
    this.#pointSelection.delete(point.id);
  }

  clearPath() {
    this.#pathSelection.clear();
  }

  clearPoint() {
    this.#pointSelection.clear();
  }

  clearSegment() {
    this.#segmentSelection.clear();
  }
}
export default Selection;
