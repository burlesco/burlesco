// What each Target does for Correio Popular today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem correio.rac.com.br/includes/js/novo_cp/fivewall.js* (:83)
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.correiopopular: scriptBlocking of the same URL
// Neither has page code.
export default {
  id: 'correiopopular',
  userscript: {
    blockRequests: [{ urls: ['*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*'] }],
  },
  firefox: {
    blockRequests: [{
      urls: ['*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*'],
      types: ['script'],
    }],
  },
};
