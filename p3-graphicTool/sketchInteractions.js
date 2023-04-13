export function btnSketchFunction(btnSketch, sketchTool) {
  btnSketch.addEventListener("click", () => {
    sketchTool.active();
  });
}
