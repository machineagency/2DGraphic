import ShapeInventory from "./ShapeInventory";

function makeDrawingPad() {
  let canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  canvas.style.backgroundColor = "white";
  let p = (() => {
    let p = new paper.PaperScope();
    p.setup(canvas);

    var decor = new p.Group({
      name: "decor",
    });

    var src = new p.Group({
      name: "src",
    });

    var view = new p.Group({
      name: "view",
    });

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
