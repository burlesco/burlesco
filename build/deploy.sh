curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$cloudflare_zone/pagerules/$cloudflare_pagerule" \
     -H "X-Auth-Email: $cloudflare_email" \
     -H "X-Auth-Key: $cloudflare_token" \
     -H "Content-Type: application/json" \
     --data '{"targets":[{"target":"url","constraint":{"operator":"matches","value":"burles.co\/userscript\/burlesco.user.js*"}}],"actions":[{"id":"forwarding_url","value":{"url":"https:\/\/github.com\/burlesco\/burlesco\/releases\/download\/'"$TRAVIS_TAG"'\/burlesco.user.js","status_code":302}}],"priority":1,"status":"active"}'
