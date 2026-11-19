// What each Target does for Nexo today, before the migration.
//
// userscript: nothing (the Site isn't in burlesco/userscript).
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.nexo: xhrBlocking of
//     https://acesso.nexojornal.com.br/paywall/*
//   - content-start.js INJECTION_START.nexo (document_start, injected
//     <script>): appends a <style> that restores body scrolling and hides
//     the PaywallBumper and Datawall containers. It assigns the implicit
//     global `style`.
//   - content.js INJECTION.nexo (document_idle, injected <script>): removes
//     the first element matching each of the two containers' selectors.
//     The selectors are missing their closing `]`; querySelector accepts
//     them anyway, and they are kept as they are.
//   - Host regex /nexojornal\.com\.br/ and the content script matches
//     *.nexojornal.com.br agree, so the generated host check changes
//     nothing.
export default {
  id: 'nexo',
  firefox: {
    blockRequests: [
      {
        urls: ['https://acesso.nexojornal.com.br/paywall/*'],
        types: ['xmlhttprequest'],
      },
    ],
    siteStart: [[
      'window.style',
      'overflow: auto !important',
      "div[class*='PaywallBumper__wrap-container']",
      "div[class*='Datawall__wrap-container']",
      'display: none !important',
      'document.head.appendChild',
    ]],
    siteIdle: [[
      "\"div[class*='PaywallBumper__wrap-container'\"",
      "\"div[class*='Datawall__wrap-container'\"",
      'document.querySelector(selector)',
      'element.remove()',
    ]],
  },
};
