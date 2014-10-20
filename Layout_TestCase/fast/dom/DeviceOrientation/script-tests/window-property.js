description('Tests that the window.DeviceOrientationEvent and window.ondeviceorientation properties are present.');

shouldBeFalse("typeof window.DeviceOrientationEvent == 'object'");
shouldBeTrue("typeof window.DeviceOrientationEvent == 'function'");
shouldBeFalse("window.propertyIsEnumerable('DeviceOrientationEvent')");
shouldBeTrue("'DeviceOrientationEvent' in window");
shouldBeTrue("window.hasOwnProperty('DeviceOrientationEvent')");

function hasOnDeviceOrientationProperty()
{
    for (var property in window) {
        if (property == 'ondeviceorientation')
            return true;
    }
    return false;
}

shouldBeTrue("typeof window.ondeviceorientation == 'object'");
shouldBeTrue("hasOnDeviceOrientationProperty()");
shouldBeTrue("'ondeviceorientation' in window");
shouldBeFalse("window.hasOwnProperty('ondeviceorientation')");
