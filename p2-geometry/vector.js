value = {
  drawArrowHead: false,
  drawLengthLabel: true,
  drawArc: true,
  drawArcLabel: true,
};

paper.install(window);
window.onload = function () {
  let canvas = document.getElementById("myCanvas");
  paper.setup(canvas);

  var tool = new Tool();
  var mainPath = new Path({
    strokeColor: "black",
  });
  var path, path2, arcPath, lengthSymbolPath, arcBasePath;
  var text, lengthText;

  var start, end;
  tool.onMouseDown = function (event) {
    if (path) path.clear();
    path = new Path();
    path.strokeColor = "black";

    minimumIndex = minIndex(mainPath.segments);
    if (minimumIndex < 0) {
      start = event.point;
    } else {
      start = mainPath.segments[minimumIndex].point;
    }
    path.add(start);
    //adding two start ensures both path:[start, end] are initialized,
    //the drag will depends on the initialized path[1].
  };

  tool.onMouseDrag = function (event) {
    end = event.point;
    placeArrow(
      path,
      start,
      (end = event.point),
      (drawArrowHead = value.drawArrowHead)
    );

    if (value.drawArc)
      placeArc(start, (end = event.point), (drawArcLabel = value.drawArcLabel));

    if (value.drawLengthLabel) placeLengthSymbol(start, (end = event.point));

    function placeArrow(path, start, end, drawArrowHead) {
      path.removeSegment(1);
      path.add(end);
      var delta = path.segments[1].point.subtract(path.segments[0].point);

      if (value.drawArrowHead) placeArrowHead(end, delta);

      function placeArrowHead(headPoint, delta) {
        path2 ? path2.clear() : (path2 = new Path());

        var arrowBasePoint = headPoint.subtract(delta.normalize(10));
        var arrowLeftPoint = arrowBasePoint.add(delta.normalize(-8).rotate(90));
        var arrowRightPoint = arrowBasePoint.add(delta.normalize(8).rotate(90));

        path2.strokeColor = "black";
        path2.add(arrowLeftPoint);
        path2.add(headPoint);
        path2.add(arrowRightPoint);
      }
    }
    function placeArc(start, end, drawArcLabel) {
      var delta = end.subtract(start);

      var from_ = new Point(30, 0);
      var through_ = from_.rotate(delta.angle / 2);
      var to_ = from_.rotate(delta.angle);

      if (arcPath) arcPath.clear();
      if (arcBasePath) arcBasePath.remove();

      arcBasePath = new Path({
        segments: [start, [start.x + 50, start.y]],
        strokeColor: "black",
        dashArray: [1, 1],
      });

      arcPath = new Path.Arc({
        from: start.add(from_),
        through: start.add(through_),
        to: start.add(to_),
        strokeColor: "black",
        dashArray: [1, 1],
      });

      if (value.drawArcLabel) placeArcTextLabel();

      function placeArcTextLabel() {
        if (text) text.content = "";
        text = new PointText({
          point: start.add(through_),
          content: `${Math.trunc(delta.angle * 1000) / 1000.0}`,
        });
      }
    }
    function placeLengthSymbol(start, end) {
      var delta = end.subtract(start);
      var upDownSegLen = 5;
      if (lengthSymbolPath) lengthSymbolPath.clear();
      lengthSymbolPath = new Path();
      var sign = delta.y > 0 ? 1 : -1;
      var upSegment = delta.normalize(upDownSegLen).rotate(45 * sign);
      var downSegment = upSegment.rotate(-90 * sign);

      var lengthSegment = delta
        .divide(2)
        .subtract(delta.normalize((2 * upDownSegLen) / Math.sqrt(2)));

      var startPoint = start.add(delta.normalize(8).rotate(90).multiply(sign));

      lengthSymbolPath.add(startPoint);
      lengthSymbolPath.lineBy(upSegment);
      lengthSymbolPath.lineBy(lengthSegment);
      lengthSymbolPath.lineBy(upSegment);
      lengthSymbolPath.lineBy(downSegment);
      lengthSymbolPath.lineBy(lengthSegment);
      lengthSymbolPath.lineBy(downSegment);
      lengthSymbolPath.dashArray = [1, 1];

      lengthSymbolPath.strokeColor = "black";

      placeLengthTextLabel();
      function placeLengthTextLabel() {
        if (lengthText) {
          lengthText.content = "";
        }
        lengthText = new PointText({
          point: lengthSymbolPath.segments[3].point.add(
            delta.normalize(8).rotate(90).multiply(sign)
          ),
          content: `${Math.trunc(delta.length * 1000) / 1000.0}`,
          justification: "center",
        });
      }
    }
  };

  tool.onMouseUp = function () {
    minimumIndex = minIndex(mainPath.segments);
    if (minimumIndex < 0) {
      mainPath.add(start);
      mainPath.add(end);
    } else if (end.getDistance(mainPath.segments[minimumIndex].point) > 10) {
      mainPath.add(end);
    } else {
      mainPath.add(mainPath.segments[minimumIndex].point);
    }

    path.remove();
    if (path2) path2.clear();
    arcPath.remove();
    lengthSymbolPath.remove();
    arcBasePath.remove();
    text.remove();
    lengthText.remove();
  };

  function minIndex(segArray) {
    if (segArray.length === 0) {
      return -1;
    }

    let minIdx = segArray.reduce(
      (index, _seg, i) =>
        end.getDistance(segArray[i].point) <
        end.getDistance(segArray[index].point)
          ? i
          : index,
      0
    );
    return minIdx;
  }
};
