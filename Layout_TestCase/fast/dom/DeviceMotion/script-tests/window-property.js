description("Tests that the window.DeviceMotionEvent and window.ondevicemotion properties are present.");

shouldBeFalse("typeof window.DeviceMotionEvent == 'object'");
shouldBeTrue("typeof window.DeviceMotionEvent == 'function'");
shouldBeFalse("window.propertyIsEnumerable('DeviceMotionEvent')");
shouldBeTrue("'DeviceMotionEvent' in window");
shouldBeTrue("window.hasOwnProperty('DeviceMotionEvent')");

function hasOnDeviceMotionProperty()
{
    for (var property in window) {
        if (property == "ondevicemotion")
            return true;
    }
    return false;
}

shouldBeTrue("typeof window.ondevicemotion == 'object'");
shouldBeTrue("hasOnDeviceMotionProperty()");
shouldBeTrue("'ondevicemotion' in window");
shouldBeFalse("window.hasOwnProperty('ondevicemotion')");
