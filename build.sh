#!/bin/bash
DIST="dist"
BROWSERS=("firefox" "opera")


for i in "${BROWSERS[@]}"
do
  DIR=$DIST/$i

  mkdir -p $DIR/src

  rm -rf "$DIR/*"

  echo $DIR/src
  cp -r src/* $DIR/src
  mv $DIR/src/manifest-$i.json $DIR/src/manifest.json
  rm -f $DIR/src/manifest-*

  file="extension.zip"
  if [ $i == "firefox" ]
    then
      file="extension.xpi"
  fi

  zip -j $DIR/$file $DIR/src/*
done
