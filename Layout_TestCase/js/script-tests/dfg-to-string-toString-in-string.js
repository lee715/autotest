description(
"Tests that we do ToString conversions correctly when String.prototype.valueOf is fine but we define our own on the String object itself."
);

function foo(a) {
    for (var i = 0; i < 100; ++i)
        a = new String(a);
    return a;
}

var argument = new String("hello");
var expected = "\"hello\"";
for (var i = 0; i < 150; ++i) {
    if (i == 100) {
        argument = new String("hello");
        argument.toString = function() { return 42; }
        expected = "\"42\"";
    }
    shouldBe("\"\" + foo(argument)", expected);
}

