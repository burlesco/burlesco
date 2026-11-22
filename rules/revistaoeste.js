// Revista Oeste. Extension only: the userscript doesn't support it today.
export default {
  id: 'revistaoeste',
  name: 'Revista Oeste',
  matches: ['*://revistaoeste.com/*'],

  firefox: {
    blockRequests: [
      {
        urls: [
          '*://revistaoeste.com/wp-content/uploads/custom-css-js/248859.js?v=*',
          '*://revistaoeste.com/wp-content/themes/revistaoeste/assets/js/main.js?ver=*',
        ],
        types: ['script'],
      },
    ],
  },
};
