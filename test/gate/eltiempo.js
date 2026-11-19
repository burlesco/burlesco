// What each Target does for El Tiempo today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match www.eltiempo.com
//   - @webRequestItem https://www.eltiempo.com/js/desktopArticle.js*
// firefox: not supported.
export default {
  id: 'eltiempo',
  userscript: {
    blockRequests: [{ urls: ['https://www.eltiempo.com/js/desktopArticle.js*'] }],
  },
};
