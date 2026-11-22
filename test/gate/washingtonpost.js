// What each Target does for The Washington Post today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.washingtonpost.com
//   - @webRequestItem *.washingtonpost.com/wp-stat/pwapi/*
// firefox: not supported.
export default {
  id: 'washingtonpost',
  userscript: {
    blockRequests: [{ urls: ['*://*.washingtonpost.com/wp-stat/pwapi/*'] }],
  },
};
