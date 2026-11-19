// What each Target does for Forbes.pl and Newsweek.pl today, before the
// migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.forbes.pl and *.newsweek.pl
//   - DOMContentLoaded, /newsweek\.pl|forbes\.pl/ host check, privileged:
//     remove the contentPremium class from .contentPremium, if present.
// firefox: not supported.
export default {
  id: 'forbespl',
  userscript: {
    privilegedIdle: [[
      "querySelector('.contentPremium')",
      "classList.remove('contentPremium')",
    ]],
  },
};
