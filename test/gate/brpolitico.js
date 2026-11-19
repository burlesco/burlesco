// What each Target does for BRPOLÍTICO today, before the migration.
//
// userscript: nothing (the Site isn't in burlesco/userscript).
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.brpolitico: xhrBlocking of
//     *.estadao.com.br/paywall/* (the paywall Estadão serves the Site)
//   - no page code
export default {
  id: 'brpolitico',
  firefox: {
    blockRequests: [
      { urls: ['*://*.estadao.com.br/paywall/*'], types: ['xmlhttprequest'] },
    ],
  },
};
