SHELL:=/bin/bash
BROWSERS=chromium firefox
DIST_DIR=dist
CRX3_KEY=burlesco-pkcs8-key.pem
.PHONY: all clean lint pre-build build
all: clean lint pre-build
clean:
	rm -rf "$(DIST_DIR)"
lint:
	set -e ; \
	find . -name '*.json' -exec python -c 'import json; json.load(open("{}"))'; \
	npx eslint src; \
	FILE=burlesco-chromium.zip
	DIR=dist/chromium
	zip -jr9X "${DIR}/${FILE}" ${DIR}/src/* ; \
	cat "${DIR}/${FILE}" | crx3 --crxPath="${DIR}/burlesco-chromium.crx" \
		--keyPath="$(CRX3_KEY)" ;
pre-build: clean
	set -e ; \
	for i in $(BROWSERS) ; do \
		SRC_DIR="$(DIST_DIR)/$$i/src" ; \
		mkdir -p "$$SRC_DIR" ; \
		cp -r src/* "$$SRC_DIR" ; \
		if [ $$i != "firefox" ]; then \
			perl -0pe 's/,\s+"applications": \{(.*?\}){2}//s' \
				src/manifest.json > "$$SRC_DIR/manifest.json" ; \
		else \
			perl -0pe 's/,\s+"update_url": "https:\/\/burlesco.github.io\/burlesco-update\/chromium.xml"//s' \
				src/manifest.json > "$$SRC_DIR/manifest.json" ; \
		fi ; \
	done
build: pre-build
	set -e ; \
	for i in $(BROWSERS) ; do \
		echo $$i; \
		DIR="$(DIST_DIR)/$$i" ; \
		FILE=burlesco-$$i.zip ; \
		if  [ $$i = "chromium" ]; then \
			zip -jr9X "$$DIR/$$FILE" $$DIR/src/* ; \
			cat "$$DIR/$$FILE" | crx3 --crxPath="$$DIR/burlesco-chromium.crx" \
				--keyPath="$(CRX3_KEY)" ; \
		else \
			zip -j "$$DIR/$$FILE" $$DIR/src/* ; \
			web-ext sign --source-dir="$$DIR/src/" \
				--artifacts-dir="$$DIR/" \
				--api-key="$$mozapi" \
				--api-secret="$$mozsecret" ; \
			mv "$$(ls $$DIR/burlesco*.xpi)" "$$DIR/burlesco-$$i.xpi" ; \
		fi ; \
	done
