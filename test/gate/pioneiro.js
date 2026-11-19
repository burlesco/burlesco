// What each Target does for Pioneiro today, before the migration.
//
// userscript: nothing (the Site isn't in burlesco/userscript).
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.pioneiro: scriptBlocking of RBS's
//     www.rbsonline.com.br/cdn/scripts/SLoader.js
//   - no page code
export default {
  id: 'pioneiro',
  firefox: {
    blockRequests: [
      { urls: ['*://www.rbsonline.com.br/cdn/scripts/SLoader.js'], types: ['script'] },
    ],
  },
};
