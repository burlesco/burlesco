// BRPOLÍTICO. Extension only: the userscript doesn't support it today.
export default {
  id: 'brpolitico',
  name: 'BRPOLÍTICO',
  matches: ['*://*.brpolitico.com.br/*'],

  firefox: {
    // The Site's paywall is served by Estadão.
    blockRequests: [
      { urls: ['*://*.estadao.com.br/paywall/*'], types: ['xmlhttprequest'] },
    ],
  },
};
