import CoordinateCalculator from "./coordinateSystem/CoordinateCalculator.js";

const CoordinateCalculatorInstance = new CoordinateCalculator();

const scaleVal = () => CoordinateCalculatorInstance.get();
const src_pointer = (p) => p.project.activeLayer.children["src"].children;
const view_pointer = (p) => p.project.activeLayer.children["view"].children;
const decor_pointer = (p) => p.project.activeLayer.children["decor"].children;
const canvas_pointer = (p) => p.project.activeLayer.children["canvas"].children;

const grp_src_pointer = (p) => p.project.activeLayer.children["src"];
const grp_view_pointer = (p) => p.project.activeLayer.children["view"];
const grp_decor_pointer = (p) => p.project.activeLayer.children["decor"];
const grp_canvas_pointer = (p) => p.project.activeLayer.children["canvas"];

const Util = {
  scale: scaleVal,
  src: src_pointer,
  view: view_pointer,
  decor: decor_pointer,
  canvas: canvas_pointer,

  srcGrp: grp_src_pointer,
  viewGrp: grp_view_pointer,
  decorGrp: grp_decor_pointer,
  canvasGrp: grp_canvas_pointer,
};

export default Util;
