// What each Target does for Seu Dinheiro today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - no request blocks
//   - DOMContentLoaded, privileged, /seudinheiro\.com/ (:444-447): removes
//     #premium-paywall and resets the body's overflow
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.seudinheiro: scriptBlocking of premium-home.js*
//     and premium-production.js* (https only)
//   - content.js INJECTION.seudinheiro (document_idle, injected <script>):
//     the same statements
const CODE = [
  "querySelector('#premium-paywall').remove()",
  "document.body.style.overflow = ''",
];

export default {
  id: 'seudinheiro',
  userscript: { privilegedIdle: [CODE] },
  firefox: {
    blockRequests: [{
      urls: [
        'https://*.seudinheiro.com/app/themes/seudinheiro/src/js/lib/premium-home.js*',
        'https://*.seudinheiro.com/app/themes/seudinheiro/js/premium-production.js*',
      ],
      types: ['script'],
    }],
    siteIdle: [CODE],
  },
};
