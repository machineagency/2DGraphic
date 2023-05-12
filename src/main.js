import ShapeInventory from "./ShapeInventory.js";
import { setupCanvas } from "./canvas/Canvas.js";
import PointData from "./pointManager/pointData.js";
import pointInventory from "./pointManager/pointInventory.js";
import Selection from "./selection/selection.js";
import SelectionVisualizer from "./selection/selectionVisualizer.js";
import sketchBuilder from "./geometry/sketch.js";

function makeDrawingPad() {
  let canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
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
let sb = new sketchBuilder(p);
let c = new p.Path.Circle(new p.Point(0, 0), 2);
let c2 = new p.Path.Circle(new p.Point(0, -1), 2);
let c3 = new p.Path.Circle(new p.Point(1, 0), 2);
c.name = "hi";
c2.name = "here";
c3.name = "bye";
s.addShape(c);
s.addShape(c2);
s.addShape(c3);
console.log(c);
console.log(pd.points, pd.intersections);

s.addShape(
  sb
    .from(0, 0)
    .line.lineTo(2, 0)
    .curve.arcTo(2, -2, false)
    .line.lineTo(0, -2)
    .close()
    .build()
);
