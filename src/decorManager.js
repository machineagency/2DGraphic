class DecorManager {
  #decorGrp;
  #decor;
  constructor(p) {
    if (!DecorManager.instance) {
      DecorManager.instance = this;
      this.#decorGrp = p.project.activeLayer.children["decor"];
      this.#decor = this.#decorGrp.children;
    }
    return DecorManager.instance;
  }

  add(path) {
    if (this.#decor[path.name]) {
      this.#decor[path.name].remove();
    }
    this.#decorGrp.addChild(path);
  }

  delete(path) {
    if (this.#decor[path.name]) {
      this.#decor[path.name].remove();
    }
  }

  clear() {
    this.#decorGrp.removeChildren();
  }
}

export default DecorManager;
