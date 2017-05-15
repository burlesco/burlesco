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
  zip -j $DIR/extension.zip $DIR/src/*
done
