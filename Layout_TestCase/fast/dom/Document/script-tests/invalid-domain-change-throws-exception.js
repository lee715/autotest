description("This test checks that a SECURITY_ERR exception is raised if an attempt is made to change document.domain to an invalid value.");

sThrow('document.domain = "apple.com"', 18);
