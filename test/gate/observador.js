// What each Target does for Observador today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem api.tinypass.com/* (:89)
//   - @connect observador.pt (:18), unused by any code
//   - DOMContentLoaded, run directly (privileged, :449-455): every 5 s,
//     removes .piano-article-blocker, lifts .article-body-wrapper's
//     max-height and marks .premium-article as shown
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.observador: scriptBlocking of *.tinypass.com/*
//   - content.js INJECTION.observador (document_idle, injected <script>):
//     the same three statements, once
//   - options.html gave it the checkbox id "veja", so it couldn't be
//     switched on its own; the generated options page doesn't repeat that
export default {
  id: 'observador',
  userscript: {
    blockRequests: [{ urls: ['*://api.tinypass.com/*'] }],
    connect: ['observador.pt'],
    privilegedIdle: [['setInterval', '5000', '.piano-article-blocker', 'article-shown']],
  },
  firefox: {
    blockRequests: [{ urls: ['*://*.tinypass.com/*'], types: ['script'] }],
    siteIdle: [['.piano-article-blocker', '.article-body-wrapper', 'article-shown']],
  },
};
