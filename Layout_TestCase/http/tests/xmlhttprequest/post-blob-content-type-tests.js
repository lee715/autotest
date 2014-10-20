var xhrBlobTestUrl = '/xmlhttprequest/resources/access-control-allow-lists.php';

var xhrBlobTestCases = [{
    mime: 'text/plain;charset=utf-8',
    expectedMime: 'text/plain;charset=utf-8'
}, {
    mime: 'Invalid/Type\r\n;charset=koi8-r',
    expectedMime: ''
}, {
    mime: 'ASCII/CR\r;charset=invalid',
    expectedMime: ''
}, {
    mime: 'ASCII/LF\n;charset=UTF-16BE',
    expectedMime: ''
}, {
    mime: 'Unicode/CRLF\u000D\u000A;charset=Ventura-US',
    expectedMime: ''
}, {
    mime: 'Unicode/CR\u000Dcharset=windows-1251',
    expectedMime: ''
}, {
    mime: 'Unicode/LF\u000Acharset=windows-1252',
    expectedMime: ''
}, {
    mime: 'multipart/mixed;boundary="--blob-boundary',
    expectedMime: ''
}, {
    mime: 'multipart/mixed;boundary="--blob-boundary"',
    expectedMime: 'multipart/mixed;boundary="--blob-boundary"'
}, {
    mime: '',
    expectedMime: ''
}, {
    mime: '\u0422\u0435\u0441\u0442',
    expectedMime: ''
}, {
    mime: 'text/plain;charset=utf-8',
    expectedMime: 'text/plain;charset=utf-8',
    shouldThrow: true,
    url: 'http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests',
    allowOrigin: ''
}, {
    mime: 'text/plain;charset=utf-8',
    expectedMime: 'text/plain;charset=utf-8',
    url: 'http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests',
    allowOrigin: '?origin=http://http://172.16.7.123/test/jetpacktest/Layout_TestCase/http/tests'
}];
