var defaltSize = 40;
var scale = 1;
var scaleFactor = 5;
var canvasGroup;

var gridSize = (defaltSize, scale, scaleFactor) => {
  return defaltSize + scale * scaleFactor;
};

export function setUpCanvas(p, canvasLayer) {
  canvasLayer.activate();
  if (!canvasGroup) {
    canvasGroup = new p.Group();
  }
  drawGridLines(
    gridSize(defaltSize, scale, scaleFactor),
    p.view.bounds,
    p.view.center,
    p,
    canvasLayer
  );
}

export function drawGridLines(gSize, boundingRect, center, p, layer) {
  layer.activate();
  canvasGroup.removeChildren();
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

  if (scale > 4) {
    var color = scale > 6 ? "black" : "#b3b3b3";
    drawLines(gSize / 5, 0.2, color);
    drawLines(gSize, 1, "black");
  } else {
    drawLines(gSize, 1, "black");
  }
}

export function btnZoomInFunction(btnZoomIn, p, canvasLayer) {
  btnZoomIn.addEventListener("click", () => {
    scale += 1;
    drawGridLines(
      gridSize(defaltSize, scale, scaleFactor),
      p.view.bounds,
      p.view.center,
      p,
      canvasLayer
    );
  });
}

export function btnZoomOutFunction(btnZoomOut, p, canvasLayer, group) {
  btnZoomOut.addEventListener("click", () => {
    scale > -4 ? (scale -= 1) : scale;
    drawGridLines(
      gridSize(defaltSize, scale, scaleFactor),
      p.view.bounds,
      p.view.center,
      p,
      canvasLayer
    );
  });
}
