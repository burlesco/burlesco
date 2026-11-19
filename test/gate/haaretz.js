// What each Target does for Haaretz today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.haaretz.com and *.haaretz.co.il
//   - @webRequestItem *.haaretz.co.il/*/inter.js and *.themarker.com/*/inter.js
//     (themarker.com has no @match; userscript blocks apply everywhere)
//   - DOMContentLoaded, /haaretz\.com/ or /haaretz\.co\.il/ host check,
//     privileged: GM_xmlhttpRequest the same URL as Googlebot (anonymous),
//     then document.open/write/close the response.
// firefox: not supported.
export default {
  id: 'haaretz',
  userscript: {
    blockRequests: [{
      urls: ['*://*.haaretz.co.il/*/inter.js', '*://*.themarker.com/*/inter.js'],
    }],
    privilegedIdle: [[
      'GM_xmlhttpRequest',
      'url: window.location.href',
      "'User-Agent': 'Googlebot/2.1 (+http://www.googlebot.com/bot.html)'",
      'anonymous: true',
      'document.write(',
    ]],
  },
};
