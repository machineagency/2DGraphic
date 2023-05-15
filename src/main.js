import ShapeInventory from "./ShapeInventory.js";
import { setupCanvas } from "./canvas/Canvas.js";
import PointData from "./pointManager/pointData.js";
import pointInventory from "./pointManager/pointInventory.js";
import Selection from "./selection/selection.js";
import SelectionVisualizer from "./selection/selectionVisualizer.js";
import PathFactory from "./geometry/PathFactory.js";
import config from "./config.js";
import BooleanOperator from "./shapeOperator/BooleanOperator.js";

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

let c = new p.Path.Circle(new p.Point(-0.5, 0), 2);
let c2 = new p.Path.Circle(new p.Point(0, -1), 2);
let c3 = new p.Path.Circle(new p.Point(1, 0), 2);
// s.addShape(c);
// s.addShape(c2);
// s.addShape(c3);
console.log(c);
console.log(pd.points, pd.intersections);

let curve = pf.Sketch.from([0, 0])
  .line.to([2, 0])
  .curve.to([2, -2])
  .through([1, -1])
  .bezier.to([2, -3])
  .handle1([3, -2.5])
  .handle2([2, -3])
  .line.to([0, -2])
  .close()
  .return();
s.addShape(curve);
s.addShape(c);

curve.depth = 3;
let res = op.subtract([c, curve]);

// selection.addPath(curve);
// selViz.visualizeSelectionPaths();
