<?php

header("Access-Control-Allow-Origin: http://http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    if (!isset($_COOKIE['foo'])) {
        header("Access-Control-Allow-Methods: PUT");
	}
} else {
    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_REQUEST['uid']) || ($_REQUEST['uid'] != $_SERVER['PHP_AUTH_USER'])) {
        header('WWW-Authenticate: Basic realm="WebKit Test Realm/Cross Origin"');
        header('HTTP/1.0 401 Unauthorized');
        echo 'Authentication canceled';
        exit;
    } else {
        echo "User: {$_SERVER['PHP_AUTH_USER']}, password: {$_SERVER['PHP_AUTH_PW']}.";
    }
}
?>
