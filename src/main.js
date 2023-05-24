import ShapeInventory from "./ShapeInventory.js";
import { setupCanvas } from "./canvas/Canvas.js";
import PointData from "./pointManager/pointData.js";
import Selection from "./selection/selection.js";
import SelectionVisualizer from "./selection/selectionVisualizer.js";
import PathFactory from "./geometry/PathFactory.js";
import config from "./config.js";
import BooleanOperator from "./shapeOperator/BooleanOperator.js";
import PathExporter from "./pathExporter/PathExporter.js";
import BooleanCutter from "./shapeOperator/BooleanCutter.js";

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
let bot = new BooleanCutter(p);
let ex = new PathExporter(p);

let c = new p.Path.Circle(new p.Point(1.2, -1), 0.5);
let c2 = new p.Path.Circle(new p.Point(-1, -1), 0.5);
let c3 = new p.Path.Circle(new p.Point(-1, 1), 0.5);

let h = new p.Path.Circle(new p.Point(1.2, -1), 0.2);
let h2 = new p.Path.Circle(new p.Point(-1, -1), 0.2);
let h3 = new p.Path.Circle(new p.Point(-1, 1), 0.2);
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
  .fromBaseWithHeight(7)
  .return();

c.depth = 7;
c2.depth = 7;
c3.depth = 7;
h.depth = 10;
h2.depth = 10;
h3.depth = 10;

let res = bot.cut(curve, c);
res = bot.cut(res, c2);
res = bot.cut(res, c3);
res = bot.cut(res, h);
res = bot.cut(res, h2);
res = bot.cut(res, h3);
console.log(res);

s.addItem(res);

let contour = ex.export(res);
