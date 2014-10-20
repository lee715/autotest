#!/usr/bin/perl -wT
use strict;

print "Cache-Control: no-store\n";

# Allow simple requests, but deny preflight.
if ($ENV{'REQUEST_METHOD'} ne "OPTIONS") {
    print "Access-Control-Allow-Credentials: true\n";
    print "Access-Control-Allow-Origin: http://http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests\n";
}

print "\n";
