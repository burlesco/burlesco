DIST="dist"
BROWSERS=("firefox" "opera")


for i in "${BROWSERS[@]}"
do
  mkdir -p "$DIST/$i/src"

  rm -rf "$DIST/$i/src/"*
  rm "$DIST/$i/extension.zip"

  cp -r src/* "$DIST/$i/src"
  mv "$DIST/$i/manifest-$i.json" "$DIST/$i/manifest.json"
  rm -f "$DIST/$i/"manifest-*
  zip -j "$DIST/$i/extension.zip" "$DIST/$i/src/"*
done
