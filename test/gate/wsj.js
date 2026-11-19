// What each Target does for The Wall Street Journal today, before the
// migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.wsj.com
//   - DOMContentLoaded, /wsj\.com/ host check, privileged, only when
//     .wsj-snippet-login exists: eraseAllCookies(), document.cookie = '',
//     clear local and session storage, then GM_xmlhttpRequest the same URL
//     with Referer https://www.facebook.com/ (anonymous); if the response has
//     an <article>, its body replaces the page's.
// firefox: not supported.
export default {
  id: 'wsj',
  userscript: {
    privilegedIdle: [[
      '.wsj-snippet-login',
      'eraseAllCookies()',
      "document.cookie = ''",
      'localStorage.clear()',
      'sessionStorage.clear()',
      'GM_xmlhttpRequest',
      'url: window.location.href',
      'https://www.facebook.com/',
      'anonymous: true',
      "querySelector('article')",
      'document.body = newDocument.body',
    ]],
  },
};
