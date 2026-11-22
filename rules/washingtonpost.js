// The Washington Post. Userscript only.
export default {
  id: 'washingtonpost',
  name: 'The Washington Post',
  matches: ['*://*.washingtonpost.com/*'],

  userscript: {
    blockRequests: [{ urls: ['*://*.washingtonpost.com/wp-stat/pwapi/*'] }],
  },
};
