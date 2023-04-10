// The minimum distance the mouse has to drag
// before firing the next onMouseDrag event:

paper.install(window);
window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  paper.setup(canvas);

  var tool = new Tool();
  tool.fixedDistance = 30;

  var path;
  var strokeEnds = 6;

  tool.onMouseDown = function (event) {
    // Create a new path and give it a stroke color:
    path = new Path();
    path.fillColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1,
    };
    //   path.strokeColor = "black";

    // Add a segment to the path where
    // you clicked:
    //   path.add(event.point)
  };

  var lastPoint;
  tool.onMouseDrag = function (event) {
    // Every drag event, add a segment
    // to the path at the position of the mouse:
    console.log(event.count);
    if (event.count == 0) {
      tool.addStrokes(event.middlePoint, event.delta.multiply(-1));
    } else {
      var step = event.delta;
      step.angle += 90;

      var top = event.middlePoint.add(step.divide(2));
      var bottom = event.middlePoint.subtract(step.divide(2));

      //   var line = new Path();
      //   line.strokeColor = "red";
      //   line.add(top);
      //   line.add(bottom);

      // top - top is appended at end of list
      path.add(top);
      // bottom - bottom are inserted in front of list
      path.insert(0, bottom);
    }
    path.smooth();

    lastPoint = event.middlePoint;
  };

  tool.onMouseUp = function (event) {
    var delta = event.point.subtract(lastPoint);
    delta.length = tool.maxDistance;
    tool.addStrokes(event.point, delta);
    path.closed = true;
    path.smooth();
  };

  tool.addStrokes = function (point, delta) {
    var step = delta.rotate(90);
    var strokePoints = strokeEnds * 2 + 1;
    point = point.subtract(step.divide(2));
    step = step.divide(strokePoints - 1);
    for (var i = 0; i < strokePoints; i++) {
      var strokePoint = point.add(step.multiply(i));
      console.log(strokePoint);
      var offset = delta.multiply(Math.random() * 0.3 + 0.1);
      if (i % 2) {
        offset = offset.multiply(-1);
      }
      strokePoint = strokePoint.add(offset);
      path.insert(0, strokePoint);
    }
  };
};
