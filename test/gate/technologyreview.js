// What each Target does for MIT Technology Review today, before the
// migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.technologyreview.com
//   - DOMContentLoaded, /technologyreview\.com/ host check, privileged:
//     remove #template-container, localStorage.clear(), then eraseCookie()
//     for xbc, _pcid, _pcus, __tbc, __pvi and _pctx. eraseCookie expires the
//     cookie with no path and with every path prefix, each with no domain
//     and with the three domain variants. It is now part of the Rule's code.
// firefox: not supported.
export default {
  id: 'technologyreview',
  userscript: {
    privilegedIdle: [[
      "document.querySelector('#template-container').remove()",
      'localStorage.clear()',
      "['xbc', '_pcid', '_pcus', '__tbc', '__pvi', '_pctx']",
      "document.domain.replace(/^www\\./, '')",
      "document.domain.replace(/^(\\w+\\.)+?(\\w+\\.\\w+)$/, '$2')",
      "'; path='",
      "'; expires=Thu, 01-Jan-1970 00:00:01 GMT;'",
    ]],
  },
};
