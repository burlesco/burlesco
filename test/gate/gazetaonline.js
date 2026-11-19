// What each Target does for Gazeta Online today, before the migration.
//
// userscript: nothing (the Site isn't in burlesco/userscript).
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.gazetaonline: cookieBlocking blockAll on
//     www.gazetaonline.com.br/* for main_frame, script and XHR. It empties
//     the Cookie request header and every Set-Cookie response header.
//   - no page code
export default {
  id: 'gazetaonline',
  firefox: {
    blockCookies: { urls: ['*://www.gazetaonline.com.br/*'] },
  },
};
