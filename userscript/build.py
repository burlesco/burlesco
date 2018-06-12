#!/usr/bin/python3
import sys
import re

code = open(sys.argv[1]).read()

webrequest_re = '// @webRequestItem (.+)\n'
matches = re.findall(webrequest_re, code, re.M)
webrequests = '// @webRequest [{}]\n'.format(','.join(matches))

count = len(matches) - 1
code = re.sub(webrequest_re, '', code, count, re.M)
code = re.sub(webrequest_re, webrequests, code)

print(code)
