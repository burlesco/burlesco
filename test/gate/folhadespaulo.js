// What each Target does for Folha today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem paywall.folha.uol.com.br/* excluding status.php
//   - @webRequestItem static.folha.uol.com.br/paywall/*
//   - document_start: injectPageCode faking paywall.folha.uol.com.br/wall.json
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.folhadespaulo: scriptBlocking and xhrBlocking
//     of paywall.folha.uol.com.br/* and static.folha.uol.com.br/paywall/*
//   - background.js WHITELIST.folhadespaulo: XHRs to exactly
//     http(s)://paywall.folha.uol.com.br/status.php go through; scripts
//     don't. The whitelist can only ever match paywall.folha.uol.com.br.
//   - content.js INJECTION.folhadespaulo (document_idle, injected <script>):
//     stubs omtrClickUOL and reveals #bt-read-more-content's sibling
export default {
  id: 'folhadespaulo',
  userscript: {
    blockRequests: [
      {
        urls: ['*://paywall.folha.uol.com.br/*'],
        except: ['*://paywall.folha.uol.com.br/status.php'],
      },
      { urls: ['*://static.folha.uol.com.br/paywall/*'] },
    ],
    siteStart: ['paywall.folha.uol.com.br/wall.json'],
  },
  firefox: {
    blockRequests: [
      {
        urls: ['*://static.folha.uol.com.br/paywall/*'],
        types: ['script', 'xmlhttprequest'],
      },
      { urls: ['*://paywall.folha.uol.com.br/*'], types: ['script'] },
      {
        urls: ['*://paywall.folha.uol.com.br/*'],
        except: ['*://paywall.folha.uol.com.br/status.php'],
        types: ['xmlhttprequest'],
      },
    ],
    siteIdle: [['omtrClickUOL', '#bt-read-more-content']],
  },
};
