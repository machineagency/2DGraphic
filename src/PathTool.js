shapeMakerLists = {
  segment: segmentFactory,
  triangle: triangleFactory,
  quadrilateral: quadrilateralFactory,
  polygon: polygonFactory,
  circle: circleFactory,
};

class InteractiveShapeMaker {
  constructor() {
    for (let shape in shapeMakerLists) {
      this.tool = new shapeMakerLists[shape]();
    }
  }
  initialize(tool) {
    tool[sha];
  }
}
