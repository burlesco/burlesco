// O Estado de S. Paulo. Both Targets block the zephr script; the extension
// also blocks Estadão's own paywall files, and the userscript stubs pwz
// instead.
export default {
  id: 'oestadodespaulo',
  name: 'O Estado de S. Paulo',
  matches: ['*://*.estadao.com.br/*'],

  blockRequests: [{
    urls: ['*://*.zephr.com/zephr-browser/*/zephr-browser.umd.js'],
    types: ['script'],
  }],

  userscript: {
    // Before pwz.js loads, so it can't replace the stub.
    siteStart: () => {
      Object.defineProperty(window, 'pwz', {
        configurable: true,
        writable: false,
        value: function () {
          console.log('paywall bloqueado');
        },
      });
    },
  },

  firefox: {
    blockRequests: [{ urls: ['*://*.estadao.com.br/paywall/*'] }],
  },
};
