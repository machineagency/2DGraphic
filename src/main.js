import ShapeInventory from "./ShapeInventory.js";
import { setupCanvas } from "./canvas/Canvas.js";
import PointData from "./pointManager/pointData.js";
import Selection from "./selection/selection.js";
import SelectionVisualizer from "./selection/selectionVisualizer.js";
import PathFactory from "./geometry/PathFactory.js";
import config from "./config.js";
import BooleanOperator from "./shapeOperator/BooleanOperator.js";
import PathExporter from "./pathExporter/PathExporter.js";

function makeDrawingPad() {
  let canvas = document.createElement("canvas");
  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;
  canvas.depth = config.canvas.depth;
  canvas.style.backgroundColor = "white";
  let p = (() => {
    let p = new paper.PaperScope();
    p.setup(canvas);
    setupCanvas(p);

    return p;
  })();
  canvas.p = p;
  return canvas;
}

let drawingPad = makeDrawingPad();
let p = drawingPad.p;
const container = document.querySelector("#canvas-container");
container.appendChild(drawingPad);

let s = new ShapeInventory(p);
let pd = new PointData();
let selection = new Selection(p);
let selViz = new SelectionVisualizer(p);
let pf = new PathFactory(p);
let op = new BooleanOperator(p);
let ex = new PathExporter(p);

let c = new p.Path.Circle(new p.Point(1, -1), 2);
let c2 = new p.Path.Circle(new p.Point(-1, -1), 0.5);
let c3 = new p.Path.Circle(new p.Point(-1, 1), 0.5);
// s.addShape(c);
// s.addShape(c2);
// s.addShape(c3);
console.log(c);
console.log(pd.points, pd.intersections);

let curve = pf.Sketch.from([0, 0])
  .line.to([2, 0])
  .line.to([2, -2])
  .line.to([-2, -2])
  .line.to([-2, 2])
  .line.to([0, 2])
  .close()
  .return();

curve.depth = 3;

// dividePath(curve);
s.addItem(c);
// s.addItem(c);
// s.addItem(c2);
// s.addItem(c3);
// let contour = ex.exportPath(curve);

// let res = op.subtract([curve, c]);
// res = op.subtract([res, c2]);
// res = op.subtract([res, c3]);
// console.log(res);
// s.addItem(res);
let contour = ex.export(c);
contour.forEach((item) => {
  s.addItem(item);
});

// selection.addPath(curve);
// selViz.visualizeSelectionPaths();
