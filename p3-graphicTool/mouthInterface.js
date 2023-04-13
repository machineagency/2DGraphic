import { Point } from "paper/dist/paper-core";
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
  var canvasTool = new p.Tool();

  var gridPath = new p.Path({
    name: "gridPath",
    segments: [[0,0], [1000,1000]],
    strokeColor: "black",
  })

  var drawGridLines = function(gridsize, boundingRect, center) {
    
    var xPos = center.x;
    var yPos = center.y;
    console.log(boundingRect.top);

    // var aLine = new p.Path.Line(new p.Point(boundingRect.left, center.y), new p.Point(boundingRect.right, center.y));

    for (var i = 0; yPos >= boundingRect.top; i++) {
      yPos -= gridsize;
      console.log(yPos);
      var leftPoint = new p.Point(boundingRect.left, yPos);
      var rightPoint = new p.Point(boundingRect.right, yPos);
      var aLine = new p.Path.Line(leftPoint, rightPoint);
      aLine.strokeColor = 'black';
    }
    yPos = center.y;

    for (var i = 0; yPos <= boundingRect.bottom; i++) {
      yPos += gridsize;
      var leftPoint = new p.Point(boundingRect.left, yPos);
      var rightPoint = new p.Point(boundingRect.right, yPos);
      var aLine = new p.Path.Line(leftPoint, rightPoint);
      aLine.strokeColor = 'black';
    }
    yPos = center.y;
  } 
  drawGridLines(40, p.view.bounds, p.view.center);


  var sketchTool = new p.Tool();

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
