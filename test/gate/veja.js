// What each Target does for Veja today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem *.abril.com.br/.../abril-paywall/js/paywall.js* (:99),
//     shared with every Abril Site
//   - DOMContentLoaded, injected <script> (:286-293, host /abril\.com\.br/):
//     after 10 s, removes body.disabledByPaywall, .piano-offer-overlay and
//     #piano_offer
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.veja: scriptBlocking of
//     https://*.abril.com.br/.../paywall.js* (https only, unlike the userscript)
//   - content.js INJECTION.veja (document_idle, injected <script>, host
//     /veja.abril.com.br/): ABRIL_CODE, the same code as the userscript
//
// Accepted change (#415): the Rule's matches are the userscript's @match,
// *://veja.abril.com.br/*. The extension's content script matched
// *://*.veja.abril.com.br/*, so in Firefox the page code no longer runs on
// subdomains of veja.abril.com.br.
export default {
  id: 'veja',
  userscript: {
    blockRequests: [{
      urls: ['*://*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*'],
    }],
    siteIdle: [['10000', 'disabledByPaywall', '.piano-offer-overlay', '#piano_offer']],
  },
  firefox: {
    blockRequests: [{
      urls: ['https://*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*'],
      types: ['script'],
    }],
    siteIdle: [['10000', 'disabledByPaywall', '.piano-offer-overlay', '#piano_offer']],
  },
};
