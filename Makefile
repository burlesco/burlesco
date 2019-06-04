SHELL:=/bin/bash
BROWSERS=firefox opera chrome chromium
DIST_DIR=dist
RSA_KEY=burlesco-rsa-key.pem
.PHONY: all clean lint pre-build build
all: clean lint pre-build build
clean:
	rm -rf "$(DIST_DIR)"
lint:
	find . -name '*.json' -exec python -c 'import json; json.load(open("{}"))' \;
	eslint webext userscript
pre-build:
	set -e ; \
	for i in $(BROWSERS) ; do \
		SRC_DIR="$(DIST_DIR)/$$i/src" ; \
		mkdir -p "$$SRC_DIR" ; \
		cp -r webext/* "$$SRC_DIR" ; \
		if [ $$i != "firefox" ]; then \
			perl -0pe 's/,\s+"applications": \{(.*?\}){2}//s' \
				webext/manifest.json > "$$SRC_DIR/manifest.json" ; \
		else \
			perl -0pe 's/,\s+"update_url": "https:\/\/raw.githubusercontent.com\/burlesco\/burlesco\/master\/updates\/chromium.xml"//s' \
				webext/manifest.json > "$$SRC_DIR/manifest.json" ; \
		fi ; \
	done
	python3 userscript/build.py userscript/burlesco.user.js > "$(DIST_DIR)/burlesco.user.js"
build:
	set -e ; \
	mkdir -p "$(DIST_DIR)" ; \
	for i in $(BROWSERS) ; do \
		echo $$i; \
		DIR="$(DIST_DIR)/$$i" ; \
		FILE=burlesco-$$i.zip ; \
		if  [ $$i = "chromium" ]; then \
			if [ ! -f "$(RSA_KEY)" ]; then \
				openssl genrsa -out "$(RSA_KEY)" 2048 2>/dev/null ;\
			fi ; \
			zip -jr9X "$$DIR/burlesco-chromium.zip" $$DIR/src/* ; \
			openssl sha1 -sha1 -binary -sign "$(RSA_KEY)" < "$$DIR/burlesco-chromium.zip" > "$$DIR/burlesco-chromium.sig" ; \
			openssl rsa -pubout -outform DER < "$(RSA_KEY)" > "$$DIR/burlesco-chromium.pub" 2>/dev/null ; \
			byte_swap () { \
				echo "$${1:6:2}$${1:4:2}$${1:2:2}$${1:0:2}" ; \
			} ; \
			crmagic_hex="4372 3234" ; \
			version_hex="0200 0000" ; \
			pub_len_hex=$$(byte_swap $$(printf '%08x\n' $$(ls -l "$$DIR/burlesco-chromium.pub" | awk '{print $$5}'))) ; \
			sig_len_hex=$$(byte_swap $$(printf '%08x\n' $$(ls -l "$$DIR/burlesco-chromium.sig" | awk '{print $$5}'))) ; \
			( \
			echo "$$crmagic_hex $$version_hex $$pub_len_hex $$sig_len_hex" | xxd -r -p ; \
			cat "$$DIR/burlesco-chromium.pub" "$$DIR/burlesco-chromium.sig" "$$DIR/burlesco-chromium.zip" ; \
			) > "$$DIR/burlesco-chromium.crx" ; \
		fi ; \
		if [ $$i = "firefox" ]; then \
			FILE="burlesco-$$i.xpi" ; \
		fi ; \
		if [ $$i != "chromium" ]; then \
			zip -j "$$DIR/$$FILE" $$DIR/src/* ; \
		fi ; \
	done
