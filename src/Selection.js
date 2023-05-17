import Util from "./Util.js";

class selection {
  #u;
  constructor(p) {
    this.#u = new Util(p);
    this.srcPaths = [];
    this.srcPoints = [];
    this.srcSegments = [];
  }
  findPath(item) {
    var a = this.srcPaths.filter((it) => it.name === item.name);
    return a.length > 0 ? a[0] : null;
  }

  viewPath() {
    this.srcPaths.map((path) => this.#u.view.get(path.name));
  }
  viewPoints() {}
  viewSegments() {}

  pushPath(path) {
    if (!this.findPath(path)) {
      this.srcPaths.push(path);
    }
  }

  clearPaths() {
    this.srcPaths = [];
  }
  clearPoint() {
    this.srcPoints = [];
  }
  clearSegments() {
    this.srcSegments = [];
  }
}
