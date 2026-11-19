// What each Target does for The New York Times today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.nytimes.com and *.nyt.com
//   - @webRequestItem *.nytimes.com/js/mtr.js
//   - DOMContentLoaded, /nytimes\.com/ host check, privileged:
//     eraseAllCookies() (now the clearCookies Technique)
//   - The host check now comes from matches, so clearCookies also runs on
//     *.nyt.com pages. Accepted widening.
// firefox: not supported.
export default {
  id: 'nytimes',
  userscript: {
    blockRequests: [{ urls: ['*://*.nytimes.com/js/mtr.js'] }],
    clearCookies: true,
  },
};
