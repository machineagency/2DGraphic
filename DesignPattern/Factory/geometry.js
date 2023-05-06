const readline = require("readline");
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const async = require("async");

class FourSidedGeometry {
  create() {}
}

class Rectangle extends fourSidedGeometry {
  create() {
    console.log("rectangle created");
  }
}

class Square extends fourSidedGeometry {
  create() {
    console.log(`squre created`);
  }
}

class FourSidedGeometryFactory {
  centeredAt(point) {
    /* abstract */
  }
}

class RectangleFactory extends FourSidedGeometryFactory {
  centeredAt(point) {
    console.log(`preparing Rectangle centered At ${point}`);
    return new rectangle();
  }
}

class SquareFactory extends fourSidedGeometryFactory {
  centeredAt(point) {
    console.log(`preparing Square centered At ${point}`);
    return new Square();
  }
}

let AvailableShapes = Object.freeze({
  square: SquareFactory,
  rectangle: RectangleFactory,
});

class FourSideShapeMaker {
  constructor() {
    this.factories = {};
    for (let shape in AvailableShapes) {
      this.factories[shape] = new AvailableShapes[shape]();
    }
  }

  makeFourSideGeometry(type) {
    switch (type) {
      case "square":
        return new SquareFactory().centeredAt("origin");
      case "rectangle":
        return new RectangleFactory().centeredAt("corner");
      default:
        throw new Error(`Don't know how to make ${type}`);
    }
  }

  interact(consumer) {
    rl.question(
      "Please specify drink and amount " + "(e.g., tea 50): ",
      (answer) => {
        let parts = answer.split(" ");
        let name = parts[0];
        let amount = parseInt(parts[1]);
        let d = this.factories[name].prepare(amount);
        rl.close();
        consumer(d);
      }
    );
  }
}

let maker = new FourSideShapeMaker();
// rl.question('which drink? ', function(answer)
// {
//   let drink = machine.makeDrink(answer);
//   drink.consume();
//
//   rl.close();
// });
maker.interact(function (drink) {
  drink.consume();
});
