// What each Target does for Superinteressante today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem *.abril.com.br/.../abril-paywall/js/paywall.js* (:99),
//     shared with every Abril Site
//   - DOMContentLoaded, injected <script> (:286-293, host /abril\.com\.br/):
//     after 10 s, removes body.disabledByPaywall, .piano-offer-overlay and
//     #piano_offer
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.superinteressante: scriptBlocking of
//     https://*.abril.com.br/.../paywall.js* (https only, unlike the userscript)
//   - content.js INJECTION.superinteressante (document_idle, injected
//     <script>, host /super.abril.com.br/): ABRIL_CODE, the same code as the
//     userscript
export default {
  id: 'superinteressante',
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
