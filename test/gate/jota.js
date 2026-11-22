// What each Target does for JOTA today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - document_start, privileged, /jota\.info/ (:111-135): on a URL with
//     "paywall", strips the www.jota.info/paywall?redirect_to=// prefix,
//     GM_xmlhttpRequests the article with a Googlebot User-Agent
//     (anonymous), removes .jota-paywall and document.write()s the result.
//     Same origin, so no @connect.
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.jota.headerInjection: Googlebot User-Agent on
//     *://www.jota.info/* (main_frame and xmlhttprequest)
//   - content.js INJECTION.jota (document_idle, injected <script>): removes
//     the first .jota-paywall; throws if there is none
export default {
  id: 'jota',
  userscript: {
    privilegedStart: [[
      "search('paywall')",
      'www.jota.info/paywall?redirect_to=//',
      'GM_xmlhttpRequest',
      'Googlebot/2.1',
      'anonymous: true',
      "getElementsByClassName('jota-paywall')[0].remove()",
      'document.write',
    ]],
  },
  firefox: {
    setRequestHeader: [{
      urls: ['*://www.jota.info/*'],
      name: 'User-Agent',
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    }],
    siteIdle: ["getElementsByClassName('jota-paywall')[0].remove()"],
  },
};
