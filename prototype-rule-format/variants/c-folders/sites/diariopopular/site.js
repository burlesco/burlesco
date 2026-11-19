export default {
  name: 'Diário Popular',
  matches: ['*://*.diariopopular.com.br/*'],
  blockCookies: { urls: ['*://www.diariopopular.com.br/*'], targets: ['firefox'] },
  clearCookies: { targets: ['userscript'] },
};
