export default {
  name: 'Exame',
  matches: ['*://*.exame.com/*'],
  // Exame left Abril: same unlock code, different paywall script.
  use: ['abril'],
  blockRequests: [{
    urls: [
      '*://exame.com/wp-content/themes/exame-new/js/pywll.js',
      '*://exame.com/wp-content/themes/exame-new/js/extd-acc.js?v=*',
    ],
  }],
};
