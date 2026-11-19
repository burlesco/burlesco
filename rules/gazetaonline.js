// Gazeta Online. Extension only: the userscript doesn't support it today.
export default {
  id: 'gazetaonline',
  name: 'Gazeta Online',
  matches: ['*://www.gazetaonline.com.br/*'],

  firefox: {
    blockCookies: { urls: ['*://www.gazetaonline.com.br/*'] },
  },
};
