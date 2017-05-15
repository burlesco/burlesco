#!/usr/bin/env python3
import os



DIST="dist"

CHROME="$DIST/chrome"
FIREFOX="$DIST/firefox"
OPERA="$DIST/opera"

BROWSERS=($CHROME $FIREFOX $OPERA)


for i in "${BROWSERS[@]}"
do
  mkdir -p "$i/src"

  rm -rf "$i"
done


exit
rm -rf dist/chrome/extension.zip dist/chrome/extension.zip
mkdir dist

cp -r src/* dist/firefox/src
rm dist/firefox/src/manifest-chrome.json
mv dist/firefox/src/manifest-firefox.json dist/firefox/manifest.json
zip -j dist/src/extension.zip dist/firefox/src/*

cp -r src/* dist/chrome/src
rm dist/chrome/src/manifest-firefox.json
mv dist/chrome/src/manifest-chrome.json dist/chrome/src/manifest.json
zip -j dist/extension.zip dist/chrome/src/*
