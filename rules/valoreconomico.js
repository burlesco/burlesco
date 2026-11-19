// Valor Econômico (Globo). Extension only.
export default {
  id: 'valoreconomico',
  name: 'Valor Econômico',
  matches: ['*://*.valor.globo.com/*'],

  firefox: {
    blockRequests: [{ urls: ['*://static.infoglobo.com.br/paywall/js/*'], types: ['script'] }],
    siteIdle: () => {
      const element = document.querySelector('[class*="paywall"]');
      if (element) element.remove();
    },
  },
};
