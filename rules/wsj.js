// The Wall Street Journal. Userscript only.
// eraseAllCookies is a helper the generated userscript provides (build/runtime.js).
/* global eraseAllCookies */
export default {
  id: 'wsj',
  name: 'The Wall Street Journal',
  matches: ['*://*.wsj.com/*'],

  userscript: {
    // Behind the login snippet: forget the visitor and refetch the page as if
    // coming from Facebook.
    privilegedIdle: () => {
      if (!document.querySelector('.wsj-snippet-login')) return;

      eraseAllCookies();

      document.cookie = '';
      localStorage.clear();
      sessionStorage.clear();

      GM_xmlhttpRequest({
        method: 'GET',
        url: window.location.href,
        headers: {
          'Referer': 'https://www.facebook.com/'
        },
        anonymous: true,
        onload: function (response) {
          var parser = new DOMParser();
          var newDocument = parser.parseFromString(response.responseText, 'text/html');
          if (newDocument.querySelector('article')) {
            document.body = newDocument.body;
          }
        }
      });
    },
  },
};
