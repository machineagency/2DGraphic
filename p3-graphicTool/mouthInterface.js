import {
  placeArrow,
  placeArc,
  placeLengthSymbol,
  placeMouthDown,
  placeMouthUp,
  value,
} from "./sketchFunctions.js";

import {
  drawGridLines,
  btnZoomInFunction,
  btnZoomOutFunction,
  setUpCanvas,
} from "./canvasFunctions.js";

import { btnSketchFunction } from "./sketchInteractions.js";

const p = new paper.PaperScope();
window.onload = function () {
  let canvas = document.getElementById("myCanvas");
  p.setup(canvas);
  var children = p.project.activeLayer.children;

  var canvasTool = new p.Tool();
  var canvasLayer = new p.Layer();
  var sketchLayer = new p.Layer();

  var canvasGroup = new p.Group();

  let btnZoomIn = document.querySelector(".btn-zoomIn");
  let btnZoomOut = document.querySelector(".btn-zoomOut");
  let btnSelect = document.querySelector(".btn-select");

  setUpCanvas(p, canvasLayer, canvasGroup);
  btnZoomInFunction(btnZoomIn, p, canvasLayer, canvasGroup);
  btnZoomOutFunction(btnZoomOut, p, canvasLayer, canvasGroup);

  var sketchTool = new p.Tool({
    name: "sketchTool",
  });

  // btnSketchFunction(btnSketch, sketchTool);
  let btnSketch = document.querySelector(".btn-sketch");
  btnSketch.addEventListener("click", () => {
    p.tools.find((tool) => tool.name === "sketchTool").activate();
    children = p.project.activeLayer.children;
  });

  var mainPath = new p.Path({
    name: "mainPath",
    strokeColor: "black",
  });

  // var tempLayer = new p.Layer();
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
