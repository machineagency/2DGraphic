class CompoundPath {
  #p;
  #paths = new Map();
  #count = 1;
  constructor(p) {
    this.#p = p;
  }

  get paths() {
    return this.#paths;
  }

  add(path) {
    this.delete(path);
    if (!path.name) path.name = `#${this.#count++}`;
    path.CompoundPath = this;
    this.#paths.set(path.name, path);
  }

  delete(path) {
    if (this.#paths.has(path.name)) {
      this.#paths.delete(path.name);
    }
  }
}

export default CompoundPath;
