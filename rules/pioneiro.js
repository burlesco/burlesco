// Pioneiro. Extension only: the userscript doesn't support it today.
export default {
  id: 'pioneiro',
  name: 'Pioneiro',
  matches: ['*://pioneiro.clicrbs.com.br/*'],

  firefox: {
    // RBS's paywall loader.
    blockRequests: [
      { urls: ['*://www.rbsonline.com.br/cdn/scripts/SLoader.js'], types: ['script'] },
    ],
  },
};
