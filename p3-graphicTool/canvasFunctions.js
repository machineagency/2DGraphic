export let canvasValues = {
  defaltSize: 40,
  scale: 1,
  scaleFactor: 5,
};

// it turns out that canvasGroup does not have to be a global variable, which is super nice.
var canvasGroup;

export var gridSize = (defaltSize, scale, scaleFactor) => {
  return defaltSize + scale * scaleFactor;
};

/**
 * Rescale the path to fit the new size of canvas. We want to rescale all points in mainPath to fit the
 * new canvas size.
 * @param {*} p - paper.js scope object where we can access the mainPath and penPath.
 */
function rescalePath(p){
  var gridScale = gridSize(canvasValues.defaltSize, canvasValues.scale, canvasValues.scaleFactor);
  var canvasPoint = (gridPoint) => {
    return new p.Point(gridPoint.x * gridScale + p.view.center.x, gridPoint.y * gridScale + p.view.center.y);
  }
  var children = p.project.activeLayer.children;
  children["mainPath"].segments.forEach((segment) => {
    segment.point = canvasPoint(children["penPath"].segments[segment.index].point);
  })
}


/**
 * Make the canvasLayer the active layer, Sets up the canvas with the grid lines and the default scale.
 * @param {*} p - paper.js scope object
 * @param {*} canvasLayer - the canvas layer given to canvas to work with.
 */
export function setUpCanvas(p, canvasLayer) {
  canvasLayer.activate();
  if (!canvasGroup) {
    canvasGroup = new p.Group();
  }
  drawGridLines(p);
}

/**
 * Calling this function will draw grid lines of calculated grid size on the canvas. As the scale changes,
 * the grid lines details will be increased or decreased to fit the canvas.
 * @param {*} p - the paper.js scope object, where we can access all canvos components.
 */
export function drawGridLines(p) {
  canvasGroup.removeChildren();
  
  var gSize = gridSize(
    canvasValues.defaltSize,
    canvasValues.scale,
    canvasValues.scaleFactor
  );
  var boundingRect = p.view.bounds;
  var center = p.view.center;
  var xPos = center.x;
  var yPos = center.y;
  

  function drawLines(newGridSize, width, color) {
    var horizontalLine = new p.Path({
      segments: [
        [boundingRect.left, center.y],
        [boundingRect.right, center.y],
      ],
      strokeWidth: 2,
      strokeColor: "Green",
    });
    canvasGroup.addChild(horizontalLine);

    var verticalLine = new p.Path({
      segments: [
        [center.x, boundingRect.bottom],
        [center.x, boundingRect.top],
      ],
      strokeWidth: 2,
      strokeColor: "Green",
    });
    canvasGroup.addChild(verticalLine);

    for (var i = 0; yPos >= boundingRect.top; i++) {
      yPos -= newGridSize;
      var leftPoint = new p.Point(boundingRect.left, yPos);
      var rightPoint = new p.Point(boundingRect.right, yPos);
      var aLine = new p.Path.Line(leftPoint, rightPoint);
      aLine.strokeColor = color;
      aLine.strokeWidth = width;
      canvasGroup.addChild(aLine);
    }
    yPos = center.y;

    for (var i = 0; yPos <= boundingRect.bottom; i++) {
      yPos += newGridSize;
      var leftPoint = new p.Point(boundingRect.left, yPos);
      var rightPoint = new p.Point(boundingRect.right, yPos);
      var aLine = new p.Path.Line(leftPoint, rightPoint);
      aLine.strokeColor = color;
      aLine.strokeWidth = width;
      canvasGroup.addChild(aLine);
    }
    yPos = center.y;

    for (var i = 0; xPos >= boundingRect.left; i++) {
      xPos -= newGridSize;
      var topPoint = new p.Point(xPos, boundingRect.top);
      var bottomPoint = new p.Point(xPos, boundingRect.bottom);
      var aLine = new p.Path.Line(topPoint, bottomPoint);
      aLine.strokeColor = color;
      aLine.strokeWidth = width;
      canvasGroup.addChild(aLine);
    }
    xPos = center.x;

    for (var i = 0; xPos <= boundingRect.right; i++) {
      xPos += newGridSize;
      var topPoint = new p.Point(xPos, boundingRect.top);
      var bottomPoint = new p.Point(xPos, boundingRect.bottom);
      var aLine = new p.Path.Line(topPoint, bottomPoint);
      aLine.strokeColor = color;
      aLine.strokeWidth = width;
      canvasGroup.addChild(aLine);
    }
    xPos = center.x;
  }

  if (canvasValues.scale > 4) {
    var color = canvasValues.scale > 6 ? "black" : "#b3b3b3";
    drawLines(gSize / 5, 0.2, color);
    drawLines(gSize, 1, "black");
  } else {
    drawLines(gSize, 1, "black");
  }
}


/**
 * Calling this function will zoom in, and calls drawGridLine function that draw grid lines of calculated grid size 
 * on the canvas.
 * @param {*} p - the paper.js scope object, where we can access all canvos components.
 * @param {*} canvasLayer - the layer of the grid lines which will be activated
 */
export function btnZoomInFunction(p, canvasLayer) {
  canvasLayer.activate();
  canvasValues.scale += 1;
  drawGridLines(p);
  rescalePath(p);
}

/**
 * Calling this function will zoom out, and calls drawGridLine function that draw grid lines of calculated grid size 
 * on the canvas.
 * @param {*} p - the paper.js scope object, where we can access all canvos components.
 * @param {*} canvasLayer - the layer of the grid lines which will be activated
 */
export function btnZoomOutFunction(p, canvasLayer) {
  canvasLayer.activate();
  if (canvasValues.scale > -4) canvasValues.scale -= 1;
  drawGridLines(p);
  rescalePath(p);
}
