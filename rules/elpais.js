// EL PAÍS: block the Arc subscription scripts and the article script that
// enforces the paywall.
export default {
  id: 'elpais',
  name: 'EL PAÍS',
  matches: ['*://*.elpais.com/*'],

  blockRequests: [{
    urls: [
      '*://prisa-el-pais-brasil-prod.cdn.arcpublishing.com/arc/subs/p.js',
      '*://prisa-el-pais-prod.cdn.arcpublishing.com/arc/subs/p.js',
      '*://brasil.elpais.com/pf/resources/dist/js/article.js*',
    ],
    types: ['script'],
  }],

  userscript: {
    // Not used by any current code; kept so the header stays the same.
    connect: ['brasil.elpais.com'],
  },
};
