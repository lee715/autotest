#!/usr/bin/perl -wT
use strict;

my $request;

if ($ENV{'REQUEST_METHOD'} eq "POST") {
    print "Content-Type: text/plain\n";
    print "Access-Control-Allow-Credentials: true\n";
    print "Access-Control-Allow-Origin: http://http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests\n\n";
    print "FAIL: Cross-domain access allowed.\n";
}
