// What each Target does for Diário Popular today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - DOMContentLoaded, privileged, /diariopopular\.com\.br/ (:349-351):
//     eraseAllCookies()
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.diariopopular.cookieBlocking (blockAll) on
//     *://www.diariopopular.com.br/*: empties Cookie on requests and
//     Set-Cookie on responses (main_frame, script, xmlhttprequest)
export default {
  id: 'diariopopular',
  userscript: {
    clearCookies: true,
  },
  firefox: {
    blockCookies: { urls: ['*://www.diariopopular.com.br/*'] },
  },
};
