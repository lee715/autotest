function test()
{
    applicationCache.oncached = function() { log("cached") }
    applicationCache.onnoupdate = function() { log("noupdate") }
    applicationCache.onerror = function() { log("error") }

    try {
        var req = new XMLHttpRequest;
        req.open("GET", "/myrs/network-simulator.php?path=/appcache/myrs/simple.txt", false);
        req.send(null);
        if (req.responseText == "Hello, World!")
            parent.postMessage("done", "*");
        else
            alert("FAIL, unexpected response: " + ex);
    } catch (ex) {
        alert("FAIL, unexpected error: " + ex);
    }
}
