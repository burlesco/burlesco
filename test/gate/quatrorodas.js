// What each Target does for Quatro Rodas today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem *.abril.com.br/.../abril-paywall/js/paywall.js* (:99),
//     shared with every Abril Site
//   - DOMContentLoaded, injected <script> (:286-293): the Abril code runs
//     here too, because its host check is /abril\.com\.br/
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.quatrorodas: scriptBlocking of
//     https://*.abril.com.br/.../paywall.js*
//   - no page code: content.js has no quatrorodas entry and the manifest no
//     content script for the Site
export default {
  id: 'quatrorodas',
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
  },
};
