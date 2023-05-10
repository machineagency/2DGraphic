import Util from "../util.js";
import { drawGridLines } from "./GridVisualizer.js";

function setupCanvas(p) {
  setupGroups(p);
  drawGridLines(p);
}

function setupGroups(p) {
  new p.Group({ name: "canvas", locked: true });
  new p.Group({ name: "decor" });
  new p.Group({ name: "src" });
  new p.Group({ name: "view" });
}

function drawGrid(p) {
  drawGridLines(p);
}

export { setupCanvas };
