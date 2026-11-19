// What each Target does for Jornal VS today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem *.fivewall.com.br/* (:85), shared with every fivewall
//     Site, plus the resource-host @match *.fivewall.com.br (:26)
//   - no page code
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.jornalvs: scriptBlocking of *.fivewall.com.br/*
//   - no page code
export default {
  id: 'jornalvs',
  userscript: {
    blockRequests: [{ urls: ['*://*.fivewall.com.br/*'] }],
  },
  firefox: {
    blockRequests: [{ urls: ['*://*.fivewall.com.br/*'], types: ['script'] }],
  },
};
