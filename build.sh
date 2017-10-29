#!/bin/bash
DIST="dist"
BROWSERS=("firefox" "opera" "chrome")

for i in "${BROWSERS[@]}"
do
  DIR=$DIST/$i

  mkdir -p $DIR/src

  rm -rf "$DIR/*"

  echo $DIR/src
  cp -r src/* $DIR/src

  file="extension.zip"
  if [ $i == "firefox" ]; then
    file="extension.xpi"
  elif [ $i == "chrome" ]; then
    perl -0pe 's/,\s+"applications": \{(.*?\}){2}//s'\
      $DIR/src/manifest.json > $DIR/src/manifest-chrome.json
   rm $DIR/src/manifest.json
   mv $DIR/src/manifest-chrome.json $DIR/src/manifest.json
  fi

  zip -j $DIR/$file $DIR/src/*
done
