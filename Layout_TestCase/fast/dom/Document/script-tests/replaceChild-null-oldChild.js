description('Test behavior of Document.replaceChild() when oldChild is null.');

sThrow('document.replaceChild(document.firstChild, null)', 8);
