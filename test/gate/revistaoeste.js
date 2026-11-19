// What each Target does for Revista Oeste today, before the migration.
//
// userscript: nothing (the Site isn't in burlesco/userscript).
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.revistaoeste: scriptBlocking of two
//     revistaoeste.com scripts (custom-css-js/248859.js and the theme's
//     main.js)
//   - no page code
export default {
  id: 'revistaoeste',
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
