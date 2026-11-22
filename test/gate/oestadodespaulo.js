// What each Target does for O Estado de S. Paulo today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem *.zephr.com/zephr-browser/*/zephr-browser.umd.js (:105).
//     No estadao.com.br/paywall/* block.
//   - document_start, /estadao\.com\.br/ (:173-184): injectPageCode makes
//     window.pwz a non-writable no-op before pwz.js loads
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.oestadodespaulo: xhrBlocking and scriptBlocking
//     of *.estadao.com.br/paywall/*; scriptBlocking of zephr-browser.umd.js
//   - no page code
export default {
  id: 'oestadodespaulo',
  userscript: {
    blockRequests: [
      { urls: ['*://*.zephr.com/zephr-browser/*/zephr-browser.umd.js'] },
    ],
    siteStart: [["'pwz'", 'writable: false', 'paywall bloqueado']],
  },
  firefox: {
    blockRequests: [
      {
        urls: ['*://*.estadao.com.br/paywall/*'],
        types: ['script', 'xmlhttprequest'],
      },
      {
        urls: ['*://*.zephr.com/zephr-browser/*/zephr-browser.umd.js'],
        types: ['script'],
      },
    ],
  },
};
