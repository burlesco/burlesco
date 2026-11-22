// What each Target does for Gazeta do Povo today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem www.netdeal.com.br/* (:82)
//   - @match *.gazetadopovo.com.br and www.netdeal.com.br (:32, :36). The
//     Rule's matches keep both; with no page code, they only feed @match.
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.gazetadopovo: scriptBlocking of netdeal
// Neither has page code.
export default {
  id: 'gazetadopovo',
  userscript: {
    blockRequests: [{ urls: ['*://www.netdeal.com.br/*'] }],
  },
  firefox: {
    blockRequests: [{ urls: ['*://www.netdeal.com.br/*'], types: ['script'] }],
  },
};
