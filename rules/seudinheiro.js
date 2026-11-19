// Seu Dinheiro: remove the paywall overlay and let the page scroll. Only
// the extension also blocks the premium scripts.

// Self-contained, so both sections can use it.
const removePaywall = () => {
  document.querySelector('#premium-paywall').remove();
  document.body.style.overflow = '';
};

export default {
  id: 'seudinheiro',
  name: 'Seu Dinheiro',
  matches: ['*://*.seudinheiro.com/*'],

  userscript: { privilegedIdle: removePaywall },

  firefox: {
    blockRequests: [{
      urls: [
        'https://*.seudinheiro.com/app/themes/seudinheiro/src/js/lib/premium-home.js*',
        'https://*.seudinheiro.com/app/themes/seudinheiro/js/premium-production.js*',
      ],
      types: ['script'],
    }],
    siteIdle: removePaywall,
  },
};
