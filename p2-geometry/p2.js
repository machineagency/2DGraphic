function basic(paper) {
  with (paper) {
    var myPoint = new Point(10, 20);
    var myPath = new Path();
    myPath.add(myPoint);

    //deep copy method 1
    var firstPoint = new Point(20, 20);
    var secondPoint = firstPoint.clone();

    //deep copy method 2
    var thirdPoint = new Point(firstPoint);

    //reference
  }
}

function rectangle(paper) {
  with (paper) {
    var topleft = new Point(10, 20);
    var size = new Size(100, 200);
    var rec = new Rectangle(topleft, size);
    // this is equivalent to
    var rec2 = new Rectangle(10, 20, 100, 200);
    console.log(rec2);

    //or specifying bottom left and top right
    var botlef = new Point(10, 120);
    var topRig = new Point(120, 10);
    var rec3 = new Rectangle(botlef, topRig);
    // or simply
    var rec4 = new Rectangle(new Point(10, 120), new Point(120, 10));

    // to change the size of the an object
    rec4.size = new Size(200, 200);

    // or directly define a rectangle
    var rect = new Rectangle();
    rect.left = 100;
    rect.right = 200;
    rect.bottom = 400;
    rect.top = 200;
    console.log(rect);
  }
}

function mathOperationBasic(paper) {
  with (paper) {
    // Define a point to start with
    var point1 = new Point(10, 20);
    console.log(point1);

    // Create a second point that is 4 times the first one.
    // This is the same as creating a new point with x and y
    // of point1 multiplied by 4:
    var point2 = point1.multiply(4);
    console.log(point2); // { x: 40, y: 80 }

    // Now we calculate the difference between the two.
    var point3 = point2.subtract(point1);
    console.log(point3); // { x: 30, y: 60 }

    // Create yet another point, with a numeric value added to point3:
    var point4 = point3.add(30);
    console.log(point4); // { x: 60, y: 90 }

    // How about a third of that?
    var point5 = point4.divide(3);
    console.log(point5); // { x: 20, y: 30 }

    // Multiplying two points with each other multiplies each
    // coordinate seperately
    var point6 = point5.multiply(new Point(3, 2));
    console.log(point6); // { x: 60, y: 60 }
  }
}

function mathOperationObject(paper) {
  with (paper) {
    var point = new Point(1.2, 1.8);

    // Round the point:
    var rounded = point.round();
    console.log(rounded); // { x: 1, y: 2 }

    // Round the point up:
    var ceiled = point.ceil();
    console.log(ceiled); // { x: 2, y: 2 }

    // Round the point down:
    var floored = point.floor();
    console.log(floored); // { x: 1, y: 1 }

    var point2 = new Point(50, 100);
    console.log(point2.length);
    point2.length *= 2;
    console.log(point2);

    console.log(`normalized val:${point2.normalize()}`);

    // Create a size whose width is between 0 and 50,
    // and height is between 0 and 100
    var size = new Size(50, 100).multiply(Size.random());
    console.log(size);
  }
}

window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  paper.setup(canvas);
  //   basic(paper);
  //   rectangle(paper);
  //   mathOperationBasic(paper);
  mathOperationObject(paper);
};
