// The New York Times. Userscript only.
export default {
  id: 'nytimes',
  name: 'The New York Times',
  matches: ['*://*.nytimes.com/*', '*://*.nyt.com/*'],

  userscript: {
    blockRequests: [{ urls: ['*://*.nytimes.com/js/mtr.js'] }],
    clearCookies: true,
  },
};
