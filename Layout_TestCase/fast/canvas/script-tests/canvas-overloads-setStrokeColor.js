description("Test the behavior of CanvasRenderingContext2D.setStrokeColor() when called with different numbers of arguments.");

var ctx = document.createElement('canvas').getContext('2d');

var TypeError = "TypeError: Type error";
var TypeErrorNotEnoughArguments = "TypeError: Not enough arguments";

shouldThrow("ctx.setStrokeColor()", "TypeErrorNotEnoughArguments");
shouldBe("ctx.setStrokeColor('red')", "undefined");
shouldBe("ctx.setStrokeColor(0)", "undefined");
shouldBe("ctx.setStrokeColor(0, 0)", "undefined");
shouldThrow("ctx.setStrokeColor(0, 0, 0)", "TypeError");
shouldBe("ctx.setStrokeColor(0, 0, 0, 0)", "undefined");
shouldBe("ctx.setStrokeColor(0, 0, 0, 0, 0)", "undefined");
shouldThrow("ctx.setStrokeColor(0, 0, 0, 0, 0, 0)", "TypeError");
