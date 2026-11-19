export default {
  id: 'diariopopular',
  name: 'Diário Popular',
  matches: ['*://*.diariopopular.com.br/*'],
  firefox: { blockCookies: { urls: ['*://www.diariopopular.com.br/*'] } },
  userscript: { clearCookies: true },
};
