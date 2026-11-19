// JOTA serves Googlebot the whole article. The extension sends Googlebot's
// User-Agent itself; the userscript can't set request headers, so it
// fetches the article as Googlebot and writes it into the page.
export default {
  id: 'jota',
  name: 'JOTA',
  matches: ['*://*.jota.info/*'],

  userscript: {
    privilegedStart: () => {
      const pageUrl = window.location.href;
      if (pageUrl.search('paywall') >= 0) {
        const newPageUrl = window.location.href
          .replace('www.jota.info/paywall?redirect_to=//', '');
        GM_xmlhttpRequest({
          method: 'GET',
          url: newPageUrl,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          },
          anonymous: true,
          onload: function (response) {
            const parser = new DOMParser();
            const newDocument = parser.parseFromString(response.responseText, 'text/html');
            newDocument.getElementsByClassName('jota-paywall')[0].remove();
            if (newDocument) {
              document.open();
              history.pushState({ urlPath: newPageUrl }, '', newPageUrl);
              document.write(newDocument.getElementsByTagName('html')[0].innerHTML);
              document.close();
            }
          },
        });
      }
    },
  },

  firefox: {
    setRequestHeader: {
      urls: ['*://www.jota.info/*'],
      name: 'User-Agent',
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
    // Page code rather than removeElements: today it throws when there's
    // no paywall, and that stays as it is.
    siteIdle: () => {
      document.getElementsByClassName('jota-paywall')[0].remove();
    },
  },
};
