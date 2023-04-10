/*
// Create a Paper.js Path to draw a line into it:
var path = new Path();
// Give the stroke a color
path.strokeColor = "black";
var start = new Point(100, 100);
// Move to start and draw a line from there
path.moveTo(start);
// Note the plus operator on Point objects.
// PaperScript does that for us, and much more!
path.lineTo(start + [100, -50]);
*/

// Only executed our code once the DOM is ready.

function drawALine(paper) {
  with (paper) {
    var path = new Path();
    // Give the stroke a color
    path.strokeColor = "black";
    var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    path.lineTo(start.add([200, -50]));
    // Draw the view now:
    view.draw();
  }
}

function drawRotatingRectangle(paper) {
  with (paper) {
    var path2 = new Path.Rectangle([300, 75], [100, 100]);
    path2.strokeColor = "#3024f2";

    view.onFrame = function (e) {
      path2.rotate(3);
    };
  }
}

function singleTool(paper) {
  with (paper) {
    var tool = new Tool();
    var path;

    tool.onMouseDown = function (event) {
      path = new Path();
      path.strokeColor = "black";
      path.add(event.point);
    };

    tool.onMouseDrag = function (event) {
      path.add(event.point);
    };
  }
}

function multipleTool(paper) {
  with (paper) {
    var path;
    function onMouseDown(event) {
      path = new Path();
      path.strokeColor = "black";
      path.add(event.point);
      console.log(tool1);
    }

    tool1 = new Tool();
    tool1.onMouseDown = onMouseDown;
    tool1.onMouseDrag = function (e) {
      path.add(e.point);
    };

    tool2 = new Tool();
    tool2.minDistance = 20;
    tool2.onMouseDown = onMouseDown;
    tool2.onMouseDrag = function (e) {
      path.arcTo(e.point);
    };
  }
}

window.onload = function () {
  // Get a reference to the canvas object
  var canvas = document.getElementById("myCanvas");
  console.log(canvas);
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);

  drawALine(paper);
  drawRotatingRectangle(paper);

  var tool1, tool2;
  console.log(tool1);
  multipleTool(paper);
};
