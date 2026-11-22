// Diário Popular counts views in cookies. The extension stops them being
// sent or set; the userscript can't, so it clears them once the page loads.
export default {
  id: 'diariopopular',
  name: 'Diário Popular',
  matches: ['*://*.diariopopular.com.br/*'],

  userscript: {
    clearCookies: true,
  },

  firefox: {
    blockCookies: { urls: ['*://www.diariopopular.com.br/*'] },
  },
};
