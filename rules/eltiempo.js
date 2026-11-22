// El Tiempo. Userscript only.
export default {
  id: 'eltiempo',
  name: 'El Tiempo',
  matches: ['*://www.eltiempo.com/*'],

  userscript: {
    blockRequests: [{ urls: ['https://www.eltiempo.com/js/desktopArticle.js*'] }],
  },
};
