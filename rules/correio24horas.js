// Correio24horas. Both Targets block the paywall script and clean up after
// it, but their cleanups have drifted apart; converging them is separate
// work.
export default {
  id: 'correio24horas',
  name: 'Correio24Horas',
  matches: ['*://*.correio24horas.com.br/*'],

  blockRequests: [{
    urls: ['*://correio-static.cworks.cloud/vendor/bower_components/paywall.js/paywall.js*'],
    types: ['script'],
  }],

  userscript: {
    siteIdle: () => {
      jQuery('[class^=paywall]').remove();
      jQuery('[class^=blocked]').removeClass();
      jQuery('[id^=paywall]').removeClass('hide').removeClass('is-active');
      jQuery('.noticias-single__content__text').attr('style', 'height:auto;');
      jQuery('[id^=paywall]').remove();
      // The article's height is reset as the layout changes.
      setInterval(function () {
        jQuery('[itemprop^=articleBody]').css('height', '100%');
        console.log('Burlesco: forçando altura...');
      }, 1000);
    },
  },

  firefox: {
    siteIdle: () => {
      jQuery('[class^=paywall]').remove();
      jQuery('[class$=blocked]').removeClass();
      jQuery('[id^=paywall]').removeClass('hide').removeClass('is-active');
      jQuery('.noticias-single__content__text').attr('style', 'height:auto;');
      jQuery('[id^=paywall]').remove();
    },
  },
};
