#!/usr/bin/perl -wT
use strict;

print "Content-Type: text/plain\n";
print "Access-Control-Allow-Credentials: true\n";
print "Access-Control-Allow-Origin: http://http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests\n\n";

print "PASS: Cross-domain access allowed.\n";
