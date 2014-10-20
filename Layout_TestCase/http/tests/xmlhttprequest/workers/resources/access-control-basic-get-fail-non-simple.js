importScripts("worker-pre.js");

onmessage = function(event)
{
   if (event.data == "START")
       start();
}

function log(message)
{
    postMessage("log " + message);
}

function done()
{
    postMessage("DONE");
}

function start()
{
    try {
	var xhr = new XMLHttpRequest;
        xhr.open("GET", "http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests/xmlhttprequest/resources/access-control-basic-get-fail-non-simple.cgi", false);
	xhr.send();
	log("PASS: Cross-domain access allowed for simple get.");
    } catch(e) {
        log("FAIL: Exception thrown. Cross-domain access is not allowed in 'open'. [" + e.message + "].");
    }


    // This is going to fail because the cgi script is not prepared for an OPTIONS request. 
    try {
	var xhr = new XMLHttpRequest;
	xhr.open("GET", "http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests/xmlhttprequest/resources/access-control-basic-get-fail-non-simple.cgi", false);
	// Non-whitelisted method
	xhr.setRequestHeader("x-webkit", "foobar");
        xhr.send();
    } catch(e) {
        log("PASS: Exception thrown. Cross-domain access was denied in 'send'. [" + e.message + "].");
    }
    done();
}
