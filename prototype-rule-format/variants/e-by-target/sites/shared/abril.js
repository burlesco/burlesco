// Page code must be self-contained: it is serialized with toString().
export const abrilPaywallScript =
  '*://*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*';

export function abrilUnlock() {
  window.setTimeout(function () {
    document.querySelector('body').classList.remove('disabledByPaywall');
    document.querySelector('.piano-offer-overlay').remove();
    document.querySelector('#piano_offer').remove();
  }, 10000);
}
