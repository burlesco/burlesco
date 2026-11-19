// What each Target does for Folha de Londrina today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem www.folhadelondrina.com.br/login.php* (:92)
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.folhadelondrina: scriptBlocking and
//     xhrBlocking of the same URL
// Neither has page code.
export default {
  id: 'folhadelondrina',
  userscript: {
    blockRequests: [{ urls: ['*://www.folhadelondrina.com.br/login.php*'] }],
  },
  firefox: {
    blockRequests: [{
      urls: ['*://www.folhadelondrina.com.br/login.php*'],
      types: ['script', 'xmlhttprequest'],
    }],
  },
};
