// What each Target does for Valor Econômico today, before the migration.
//
// userscript: nothing.
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.valoreconomico: scriptBlocking of
//     static.infoglobo.com.br/paywall/js/*
//   - content.js INJECTION.valoreconomico (document_idle, injected <script>,
//     host /valor.globo.com/): removes the first [class*="paywall"], if any
export default {
  id: 'valoreconomico',
  firefox: {
    blockRequests: [{ urls: ['*://static.infoglobo.com.br/paywall/js/*'], types: ['script'] }],
    siteIdle: [['[class*="paywall"]', '.remove()']],
  },
};
