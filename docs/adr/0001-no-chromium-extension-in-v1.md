# No Chromium extension in v1

The universal build (#372) produces two Targets: the userscript and the Firefox extension. Google removed Burlesco from the Chrome Web Store, current Chrome no longer loads Manifest V2 extensions, and burles.co already sends Chrome users to the userscript. An MV3 build could only be installed in developer mode. Rules still describe network Techniques as data, so a Chromium MV3 Target (`declarativeNetRequest`) can be added later without rewriting them.
