BUILD_DIR="./gh-pages/"
mkdir -p $BUILD_DIR

cat > $BUILD_DIR/chromium.xml <<EOL
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='magjmaimhngoidhmklnpihkdjkggbpnp'>
    <updatecheck codebase='https://github.com/burlesco/burlesco/releases/download/${{ github.ref }}/burlesco-chromium.crx' version='${{ github.ref }}' />
  </app>
</gupdate>
EOL


cat > $BUILD_DIR/firefox.json <<EOL
{
  "addons": {
    "burlesco@burles.co": {
      "updates": [
        {
          "version": "${{ github.ref }}",
          "update_link": "https://github.com/burlesco/burlesco/releases/download/${{ github.ref }}/burlesco-firefox.xpi"
        }
      ]
    }
  }
}
EOL

