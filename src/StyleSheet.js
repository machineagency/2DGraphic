import config from "./config.js";
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
    let maxDepth = config.canvas.depth; //... set your max depth value
    let minColor = 0; // darkest green value
    let maxColor = 218; // brightest green value
    let midColor = Math.floor((minColor + maxColor) / 2); // mid-point green value

    // Normalize depth to [0, 1] range
    let normalizedDepth = shape.depth / maxDepth;

    // Interpolate color value
    let greenValue = Math.round(
      midColor - normalizedDepth * (midColor - minColor)
    );

    // Ensure color value is within [0, 255] range
    greenValue = Math.max(0, Math.min(255, greenValue));

    // Convert color value to hexadecimal
    let greenHex = greenValue.toString(16);
    if (greenHex.length < 2) greenHex = "0" + greenHex;

    // Create color string
    let color = "#44" + greenHex.toUpperCase() + "B9";

    shape.strokeColor = "black";
    shape.strokeWidth = 2;
    shape.fillColor = color;
  },
  canvas: canvasStyle,
  selection: selectionStyle,
};

export default Style;
