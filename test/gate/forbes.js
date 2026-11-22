// What each Target does for Forbes today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.forbes.com
//   - DOMContentLoaded, /forbes\.com/ host check, privileged: every 2 s,
//     remove the zephr-modal-open class, .zephr-backdrop and
//     .zephr-generic-modal.
// firefox: not supported.
export default {
  id: 'forbes',
  userscript: {
    privilegedIdle: [[
      'setInterval(',
      "classList.remove('zephr-modal-open')",
      "querySelector('.zephr-backdrop')?.remove()",
      "querySelector('.zephr-generic-modal')?.remove()",
      '}, 2000)',
    ]],
  },
};
