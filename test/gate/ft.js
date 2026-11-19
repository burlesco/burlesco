// What each Target does for the Financial Times today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.ft.com
//   - DOMContentLoaded, /ft\.com/ host check, privileged, only when
//     .barrier-banner exists: eraseAllCookies(), document.cookie = '', clear
//     local and session storage, delete the next-flags and next:ads
//     IndexedDB databases, remove .o-cookie-message, then GM_xmlhttpRequest
//     the same URL with Referer https://www.google.com.br/ (anonymous); if
//     the response has .article__content, document.open/write/close it.
// firefox: not supported.
export default {
  id: 'ft',
  userscript: {
    privilegedIdle: [[
      '.barrier-banner',
      'eraseAllCookies()',
      "document.cookie = ''",
      'localStorage.clear()',
      'sessionStorage.clear()',
      "indexedDB.deleteDatabase('next-flags')",
      "indexedDB.deleteDatabase('next:ads')",
      "document.querySelector('.o-cookie-message').remove()",
      'GM_xmlhttpRequest',
      'url: window.location.href',
      'https://www.google.com.br/',
      'anonymous: true',
      'article__content',
      'document.write(',
    ]],
  },
};
