rm -rf dist/burlesco-chrome.zip dist/burlesco-firefox.zip
mkdir dist

cp -r src/* dist/firefox
rm dist/firefox/manifest-chrome.json
mv dist/firefox/manifest-firefox.json dist/firefox/manifest.json
zip -j dist/burlesco-firefox.zip dist/firefox/*

cp -r src/* dist/chrome
rm dist/chrome/manifest-firefox.json
mv dist/chrome/manifest-chrome.json dist/chrome/manifest.json
zip -j dist/burlesco-chrome.zip dist/chrome/*
