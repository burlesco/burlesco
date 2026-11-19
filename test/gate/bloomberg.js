// What each Target does for Bloomberg today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match www.bloomberg.com
//   - DOMContentLoaded, /bloomberg\.com/ host check, privileged: clear local
//     and session storage.
// firefox: not supported.
export default {
  id: 'bloomberg',
  userscript: {
    privilegedIdle: [['localStorage.clear()', 'sessionStorage.clear()']],
  },
};
