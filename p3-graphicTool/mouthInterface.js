import {
  placeArrow,
  placeArc,
  placeLengthSymbol,
  placeMouthDown,
  placeMouthUp,
  value,
} from "./sketchFunctions.js";

const p = new paper.PaperScope();
window.onload = function () {
  let canvas = document.getElementById("myCanvas");
  p.setup(canvas);
  var children = p.project.activeLayer.children;

  var sketchTool = new p.Tool();
  var mainPath = new p.Path({
    name: "mainPath",
    strokeColor: "black",
  });

  var start, end;
  sketchTool.onMouseDown = function (event) {
    start = placeMouthDown(event.point, p, children);
  };

  sketchTool.onMouseDrag = function (event) {
    placeArrow(start, event.point, p, value, children);

    if (value.drawArc) placeArc(start, event.point, p, value, children);

    if (value.drawLengthLabel)
      placeLengthSymbol(start, event.point, p, value, children);
  };

  sketchTool.onMouseUp = function (event) {
    end = event.point;
    placeMouthUp(start, end, children);
  };
};
