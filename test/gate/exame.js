// What each Target does for Exame today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem exame.com/.../exame-new/js/pywll.js (:100); not
//     extd-acc.js
//   - no page code: the Abril host check /abril\.com\.br/ doesn't match
//     exame.com
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.exame: scriptBlocking of pywll.js and
//     extd-acc.js?v=*
//   - content.js INJECTION.exame (document_idle, injected <script>):
//     ABRIL_CODE. It never ran: the host check was /exame\.com\.br/ and the
//     Site is exame.com. With host checks generated from matches it now runs,
//     the intended side effect named in spec #415 (Out of Scope).
export default {
  id: 'exame',
  userscript: {
    blockRequests: [{ urls: ['*://exame.com/wp-content/themes/exame-new/js/pywll.js'] }],
  },
  firefox: {
    blockRequests: [{
      urls: [
        '*://exame.com/wp-content/themes/exame-new/js/pywll.js',
        '*://exame.com/wp-content/themes/exame-new/js/extd-acc.js?v=*',
      ],
      types: ['script'],
    }],
    siteIdle: [['10000', 'disabledByPaywall', '.piano-offer-overlay', '#piano_offer']],
  },
};
