const canvasStyle = {
  CenterGridLine: (line) => {
    line.strokeColor = "green";
    line.strokeWidth = 1.2;
  },
  GridLine: (line) => {
    line.strokeColor = "black";
    line.strokeWidth = 0.8;
  },
  InnerGridLine: (line) => {
    line.strokeColor = "#b3b3b3";
    line.strokeWidth = 0.3;
  },
};

const selectionStyle = {
  pointHighlight: (shape) => {
    shape.fillColor = "white";
    shape.strokeColor = "green";
    shape.locked = true;
  },

  segmentHighlight: (line) => {
    line.strokeColor = "green";
  },

  pathHighlight: (path) => {
    path.strokeColor = "green";
    path.fillColor = "#44DAB9";
    shape.fillColor.alpha = 0.5;
  },
};

const Style = {
  viewPathStyle: (path) => {
    path.strokeColor = "black";
    strokeWidth = 2;
  },
  viewShapeStyle: (shape) => {
    shape.strokeColor = "black";
    shape.strokeWidth = 2;
    shape.fillColor = "#44DAB9";
    shape.fillColor.alpha = 0.3;
  },
  canvas: canvasStyle,
  selection: selectionStyle,
};

export default Style;
