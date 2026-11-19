// What each Target does for Correio do Povo today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.correiodopovo.com.br
//   - document-start, /correiodopovo\.com\.br/ host check, privileged:
//     cleanPaywall (remove [id^="pwm"] > div and > iframe, set body overflow
//     to initial) is scheduled for 4 s later, then run right away. At
//     document-start the body may not exist yet, so the first run can throw.
// firefox: not supported.
export default {
  id: 'correiodopovo',
  userscript: {
    privilegedStart: [[
      "document.querySelector('[id^=\"pwm\"] > div')",
      "document.querySelector('[id^=\"pwm\"] > iframe')",
      "document.querySelector('body').style.overflow = 'initial'",
      'setTimeout(cleanPaywall, 4000)',
      'cleanPaywall();',
    ]],
  },
};
