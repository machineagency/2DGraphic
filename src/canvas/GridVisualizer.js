import Util from "../util.js";
import Style from "../StyleSheet.js";

function drawGridLines(p) {
  Util.canvasGrp(p).removeChildren();
  let scale = Util.scale();

  let canvasBounds = p.view.bounds;
  let center = p.view.center;

  drawGrid(p, scale, center, canvasBounds);
}

function drawGrid(p, scale, center, bound) {
  // Draw horizontal and vertical grid lines
  if (scale > 65) {
    drawLines(p, scale / 5, center, bound, Style.canvas.InnerGridLine);
    drawLines(p, scale, center, bound, Style.canvas.GridLine);
  } else {
    drawLines(p, scale, center, bound, Style.canvas.GridLine);
  }

  drawLine(
    p,
    new p.Point(bound.left, center.y),
    new p.Point(bound.right, center.y),
    Style.canvas.CenterGridLine
  );
  drawLine(
    p,
    new p.Point(center.x, bound.top),
    new p.Point(center.x, bound.bottom),
    Style.canvas.CenterGridLine
  );
}

function drawLines(p, scale, center, bound, gridStyle) {
  drawHorizontalLines(p, scale, center, bound, gridStyle);
  drawVerticalLines(p, scale, center, bound, gridStyle);
  drawHorizontalLines(p, -scale, center, bound, gridStyle);
  drawVerticalLines(p, -scale, center, bound, gridStyle);
}

function drawLine(p, start, end, style) {
  const line = new p.Path.Line(start, end);
  style(line);
  Util.canvasGrp(p).addChild(line);
}

function drawHorizontalLines(p, step, center, bound, style) {
  for (
    let yPos = center.y;
    yPos >= bound.top && yPos <= bound.bottom;
    yPos += step
  ) {
    drawLine(
      p,
      new p.Point(bound.left, yPos),
      new p.Point(bound.right, yPos),
      style
    );
  }
}

function drawVerticalLines(p, step, center, bound, style) {
  for (
    let xPos = center.x;
    xPos >= bound.left && xPos <= bound.right;
    xPos += step
  ) {
    drawLine(
      p,
      new p.Point(xPos, bound.top),
      new p.Point(xPos, bound.bottom),
      style
    );
  }
}

export { drawGridLines };
