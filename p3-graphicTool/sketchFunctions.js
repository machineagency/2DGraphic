//Don't write children['xxxx'] as xxxx = children['xxxx']. It will cause the variable to be undefined.
//and the children['xxxx'] won't be correctly updated.

export let value = {
  drawArrowHead: true,
  drawLengthLabel: false,
  drawArc: true,
  drawArcLabel: true,
};

/**
 * placeArrow draws the line that user drags from a to b, then places a head to the tip of the line ending to show line's direction.
 * caller can pass either *uninitialized or initialized @arrowHeadPath path variable.
 * @param {*} start - origin of the line where the user's drag starts, if a line is (a, b), start will be a.
 * @param {*} end - end of the line where the user's drag ends, if a line is (a, b), end will be b.
 * @param {*} p - scope of the canvas
 * @param {*} value - global setting varible, value.drawArrowHead will be checked to draw the "<" of <-- or not --.
 * @param {*} children - paths containers where details of (@arrowHeadPath) will be drawn to.
 */

export function placeArrow(start, end, p, value, children) {
  let placeArrowHead = function (headPoint, delta) {
    children["arrowHeadPath"]
      ? (children["arrowHeadPath"].segments = [])
      : (children["arrowHeadPath"] = new p.Path());

    var arrowBasePoint = headPoint.subtract(delta.normalize(10));
    var arrowLeftPoint = arrowBasePoint.add(delta.normalize(-8).rotate(90));
    var arrowRightPoint = arrowBasePoint.add(delta.normalize(8).rotate(90));

    children["arrowHeadPath"].strokeColor = "black";
    children["arrowHeadPath"].add(arrowLeftPoint);
    children["arrowHeadPath"].add(headPoint);
    children["arrowHeadPath"].add(arrowRightPoint);
    return children["arrowHeadPath"];
  };
  children["mouthDownPath"].removeSegment(1);
  children["mouthDownPath"].add(end);
  var delta = children["mouthDownPath"].segments[1].point.subtract(start);
  if (value.drawArrowHead)
    children["arrowHeadPath"] = placeArrowHead(end, delta);
}

/**
 * placeLengthSymbol function draws the text/number for the line user drags, and draws a bracket to visualize the relationship between
 * the line and the number. caller can pass either *uninitialized or initialized @text, @arcBasePath or @arcPath path variable.
 * @param {*} start - origin of the line where the user's drag starts, if a line is (a, b), start will be a.
 * @param {*} end - end of the line where the user's drag ends, if a line is (a, b), end will be b.
 * @param {*} p - scope of the canvas.
 * @param {*} value - global setting varible, value.drawArcLabel will be checked to draw the @text or not.
 * @param {*} children - path containers where details of (@arcText, @arcBasePath and @arcPath) will be drawn to.
 */
export function placeArc(start, end, p, value, children) {
  let placeArcTextLabel = function () {
    // if the text is uninitialized, initialize it with a path variable
    // if the text is initialized, clear all it's content on the canvas, and reinitialize.
    if (children["arcText"]) children["arcText"].content = "";
    children["arcText"] = new p.PointText({
      point: start.add(through_),
      content: `${Math.trunc(delta.angle * 1000) / 1000.0}`,
    });
    return children["arcText"];
  };

  var delta = end.subtract(start);
  var from_ = new p.Point(30, 0);
  var through_ = from_.rotate(delta.angle / 2);
  var to_ = from_.rotate(delta.angle);

  // if the arcPath or arcBasePath is uninitialized, initialize them with a path variable
  // if the arcPath or arcBasePath is initialized, clear their path on the canvas, and reinitialize.
  if (children["arcPath"]) children["arcPath"].clear();
  if (children["arcBasePath"]) children["arcBasePath"].remove();

  children["arcBasePath"] = new p.Path({
    segments: [start, [start.x + 50, start.y]],
    strokeColor: "black",
    dashArray: [1, 1],
  });

  children["arcPath"] = new p.Path.Arc({
    from: start.add(from_),
    through: start.add(through_),
    to: start.add(to_),
    strokeColor: "black",
    dashArray: [1, 1],
  });

  if (value.drawArcLabel) children["arcText"] = placeArcTextLabel();
}

/**
 * placeLengthSymbol function draws the text/number for the line user drags, and draws a bracket to visualize the relationship between
 * the line and the number. caller can pass either *uninitialized or initialized @lengthText and @lengthSymbolPath path variable.
 * @param {*} start - origin of the line where the user's drag starts, if a line is (a, b), start will be a.
 * @param {*} end - end of the line where the user's drag ends, if a line is (a, b), end will be b.
 * @param {*} p - global setting varible, value.drawLengthLabel will be checked to draw the @Textlabel or not.
 * @param {*} value - scope paths(lengthText and lengthSymbolPath) will be drawn to.
 * @param {*} children - path containers where details of (@lengthText and @lengthSymbolPath) will be drawn to.
 * @return {the updated lengthText and lengthSymbolPath variables that contains desired drawing content.}
 */
export function placeLengthSymbol(start, end, p, value, children) {
  let placeLengthTextLabel = function () {
    // if the lengthText is uninitialized, initialize it with a path variable
    // if the lengthText is initialized, clear all it's content on the canvas, and reinitialize.
    if (children["lengthText"]) {
      children["lengthText"].content = "";
    }
    children["lengthText"] = new p.PointText({
      point: children["lengthSymbolPath"].segments[3].point.add(
        delta.normalize(8).rotate(90).multiply(sign)
      ),
      content: `${Math.trunc(delta.length * 1000) / 1000.0}`,
      justification: "center",
    });

    return children["lengthText"];
  };
  var delta = end.subtract(start);
  var upDownSegLen = 5;

  // if the lengthSymbolPath is uninitialized, initialize it with a path variable
  // if the lengthSymbolPath is initialized, clear it's path on the canvas, and reinitialize.
  if (children["lengthSymbolPath"]) children["lengthSymbolPath"].clear();
  children["lengthSymbolPath"] = new p.Path();

  var sign = delta.y > 0 ? 1 : -1;
  var upSegment = delta.normalize(upDownSegLen).rotate(45 * sign);
  var downSegment = upSegment.rotate(-90 * sign);
  var lengthSegment = delta
    .divide(2)
    .subtract(delta.normalize((2 * upDownSegLen) / Math.sqrt(2)));
  var startPoint = start.add(delta.normalize(8).rotate(90).multiply(sign));

  children["lengthSymbolPath"].add(startPoint);
  children["lengthSymbolPath"].lineBy(upSegment);
  children["lengthSymbolPath"].lineBy(lengthSegment);
  children["lengthSymbolPath"].lineBy(upSegment);
  children["lengthSymbolPath"].lineBy(downSegment);
  children["lengthSymbolPath"].lineBy(lengthSegment);
  children["lengthSymbolPath"].lineBy(downSegment);
  children["lengthSymbolPath"].dashArray = [1, 1];
  children["lengthSymbolPath"].strokeColor = "black";

  if (value.drawLengthLabel) children["lengthText"] = placeLengthTextLabel();
}

/**
 *
 * @param {*} start - the origin of the line where the user's drag starts, if a line is (a, b), start will be a.
 * @param {*} p - the scope paths(mouthDownPath) will be drawn to.
 * @param {*} mouthDownPath - the path variable for mouth down symbol.
 * @returns {start} the updated start point for the next line.
 *                  Start will be the end of the line where the previous user's drag ends.
 */
export function placeMouthDown(start, p, children) {
  if (children["mouthDownPath"]) children["mouthDownPath"].clear();
  children["mouthDownPath"] = new p.Path();
  children["mouthDownPath"].strokeColor = "black";
  if (children["mainPath"].segments.length > 0) {
    start =
      children["mainPath"].segments[children["mainPath"].segments.length - 1]
        .point;
  }
  children["mouthDownPath"].add(start);

  return start;
}

/**
 * placeMouthUp function dictates where the line ends, and cleans up the canvas.
 *
 * @param {*} start - the origin of the line where the user's drag starts, if a line is (a, b), start will be a.
 * @param {*} end - the end of the line where the user's drag ends, if a line is (a, b), end will be b.
 * @param {*} children - the scope paths
 *                  (mainPath, mouthDownPath, arrowHeadPath, arcPath, lengthSymbolPath, arcBasePath, arcText, lengthText)
 *                   will be cleared from.
 */
export function placeMouthUp(start, end, p, children, gridScale) {
  let minimumIndex = minIndex(end, children["mainPath"].segments);
  if (minimumIndex < 0) {
    // first time drawing
    children["mainPath"].add(start);
    children["mainPath"].add(end);
  } else if (
    // if the end point is not too close to the existing point, add the end point/
    end.getDistance(children["mainPath"].segments[minimumIndex].point) > 10
  ) {
    children["mainPath"].add(end);
  } else {
     // if the end point is too close to the existing point, add the existing point/
    children["mainPath"].add(children["mainPath"].segments[minimumIndex].point);
  }

  if (children["mouthDownPath"]) children["mouthDownPath"].remove();
  if (children["arrowHeadPath"]) children["arrowHeadPath"].clear();
  if (children["arcPath"]) children["arcPath"].remove();
  if (children["lengthSymbolPath"]) children["lengthSymbolPath"].remove();
  if (children["arcBasePath"]) children["arcBasePath"].remove();
  if (children["arcText"]) children["arcText"].remove();
  if (children["lengthText"]) children["lengthText"].remove();

  calcGridCordinate(p, children, gridScale, start, end);
}


function calcGridCordinate(p, children, gridScale, start, end) {
  var GridPoint = (canvasPoint) => {
    return new p.Point((canvasPoint.x - p.view.center.x)/gridScale, (canvasPoint.y - p.view.center.y)/gridScale);
  }
  var canvasPoint = (gridPoint) => {
    return new p.Point(gridPoint.x * gridScale + p.view.center.x, gridPoint.y * gridScale + p.view.center.y);
  }

  if(children["penPath"].segments.length > 0) {
    children["penPath"].add(GridPoint(end));
  } else {
    children["penPath"].add(GridPoint(start));
    children["penPath"].add(GridPoint(end));
  }
}

function minIndex(point, segArray) {
  if (segArray.length === 0) {
    return -1;
  }

  let minIdx = segArray.reduce(
    (index, _seg, i) =>
      point.getDistance(segArray[i].point) <
      point.getDistance(segArray[index].point)
        ? i
        : index,
    0
  );
  return minIdx;
}
