// What each Target does for NSC Total today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem https://paywall.nsctotal.com.br/behaviors (:91)
//   - @webRequestItem dashboard.tinypass.com/xbuilder/experience/load* (:84)
//     and cdn.tinypass.com/api/tinypass.min.js (:88). They belong to no Site
//     (2017 O Globo/tinypass era, dc9a471); userscript blocks are global, so
//     the NSC Total Rule, the other tinypass Site, carries them. So do the
//     resource-host @match lines api|cdn|dashboard.tinypass.com (:40-42).
//   - no page code
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.nsctotal: xhrBlocking of
//     https://paywall.nsctotal.com.br/behaviors, scriptBlocking of
//     *.tinypass.com/*
//   - no page code
export default {
  id: 'nsctotal',
  userscript: {
    blockRequests: [{
      urls: [
        'https://paywall.nsctotal.com.br/behaviors',
        '*://dashboard.tinypass.com/xbuilder/experience/load*',
        '*://cdn.tinypass.com/api/tinypass.min.js',
      ],
    }],
  },
  firefox: {
    blockRequests: [
      { urls: ['https://paywall.nsctotal.com.br/behaviors'], types: ['xmlhttprequest'] },
      { urls: ['*://*.tinypass.com/*'], types: ['script'] },
    ],
  },
};
