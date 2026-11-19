window.setTimeout(function () {
  document.querySelector('body').classList.remove('disabledByPaywall');
  document.querySelector('.piano-offer-overlay').remove();
  document.querySelector('#piano_offer').remove();
}, 10000);
