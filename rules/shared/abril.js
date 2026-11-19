// Shared by the Abril Sites (Veja, Superinteressante, Quatro Rodas, Exame).

// Abril's paywall script. The extension only ever blocked it over https.
const PAYWALL_JS = '*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*';

export const blockPaywall = {
  userscript: { urls: [`*://${PAYWALL_JS}`] },
  firefox: { urls: [`https://${PAYWALL_JS}`], types: ['script'] },
};

// Once the paywall has had time to show, take it down.
export const unlock = () => {
  window.setTimeout(function () {
    document.querySelector('body').classList.remove('disabledByPaywall');
    document.querySelector('.piano-offer-overlay').remove();
    document.querySelector('#piano_offer').remove();
  }, 10000);
};
