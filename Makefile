SHELL:=/bin/bash
BROWSERS=chromium firefox
DIST_DIR=dist
CRX2_KEY=burlesco-rsa-key.pem
CRX3_KEY=burlesco-pkcs8-key.pem
.PHONY: all clean lint pre-build build
all: clean lint pre-build build
clean:
	rm -rf "$(DIST_DIR)"
lint:
	find . -name '*.json' -exec python -c 'import json; json.load(open("{}"))' \;
	eslint webext userscript
pre-build: clean
	set -e ; \
	for i in $(BROWSERS) ; do \
		SRC_DIR="$(DIST_DIR)/$$i/src" ; \
		mkdir -p "$$SRC_DIR" ; \
		cp -r webext/* "$$SRC_DIR" ; \
		if [ $$i != "firefox" ]; then \
			perl -0pe 's/,\s+"applications": \{(.*?\}){2}//s' \
		webext/manifest.json > "$$SRC_DIR/manifest.json" ; \
		fi ; \
	done
	python3 userscript/build.py userscript/burlesco.user.js > "$(DIST_DIR)/burlesco.user.js"
build: pre-build
	set -e ; \
	for i in $(BROWSERS) ; do \
		echo $$i; \
		DIR="$(DIST_DIR)/$$i" ; \
		FILE=burlesco-$$i.zip ; \
		if  [ $$i = "chromium" ]; then \
			if [ ! -f "$(CRX2_KEY)" ]; then \
				openssl genrsa -out "$(CRX2_KEY)" 2048 2>/dev/null ; \
			fi ; \
			if [ ! -f "$(CRX3_KEY)" ]; then \
				openssl genpkey -out "$(CRX3_KEY)" -algorithm RSA -pkeyopt rsa_keygen_bits:2048 2>/dev/null ; \
			fi ; \
			zip -jr9X "$$DIR/$$FILE" $$DIR/src/* ; \
			cat "$$DIR/$$FILE" | crx3 --crxPath="$$DIR/burlesco-chromium.crx" \
				--keyPath="$(CRX3_KEY)" ; \
			crx pack "$$DIR/src/" \
				--output="$$DIR/burlesco-chromium-deprecated.crx" \
				--private-key="$(CRX2_KEY)" ; \
		fi ; \
		if [ $$i = "firefox" ]; then \
			zip -j "$$DIR/$$FILE" $$DIR/src/* ; \
			web-ext sign --source-dir="$$DIR/src/" \
				--artifacts-dir="$$DIR/" \
				--api-key="{{api_key}}" \
				--api-secret="{{api_secret}}" ; \
			mv "$$(ls $$DIR/burlesco*.xpi)" "$$DIR/burlesco-$$i.xpi" ; \
		fi ; \
	done
