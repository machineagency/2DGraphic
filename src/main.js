import ShapeInventory from "./ShapeInventory.js";
import { setupCanvas } from "./canvas/Canvas.js";
import PointData from "./pointManager/pointData.js";
import pointInventory from "./pointManager/pointInventory.js";
import Selection from "./selection/selection.js";
import SelectionVisualizer from "./selection/selectionVisualizer.js";
import PathFactory from "./geometry/PathFactory.js";

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
let pf = new PathFactory(p);
let c = new p.Path.Circle(new p.Point(0, 0), 2);
let c2 = new p.Path.Circle(new p.Point(0, -1), 2);
let c3 = new p.Path.Circle(new p.Point(1, 0), 2);
// s.addShape(c);
// s.addShape(c2);
// s.addShape(c3);
console.log(c);
console.log(pd.points, pd.intersections);

let curve = pf.Sketch.from([0, 0])
  .line.to([2, 0])
  .draw()
  .curve.to([2, -2])
  .through([1, -1])
  .draw()
  .bezier.to([2, -3])
  .handle2([3, -3.5])
  .handle1([3, -2.5])
  .draw()
  .line.to([0, -2])
  .draw()

  .close()
  .return();
s.addShape(curve);

selection.addPath(curve);
selViz.visualizeSelectionPaths();

console.log(curve);

// s.addShape(
//   pf.Shape.rectangle.centerAt(0, 0).setHeight(5).setWidth(1.5).build()
// );

// console.log(
//   pf.Shape.circle.centerAt(1, 2).setRadius(2).setDepth(12).build().depth
// );
