const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

export default {
  id: 'jota',
  name: 'JOTA',
  matches: ['*://*.jota.info/*'],

  setRequestHeader: { urls: ['*://www.jota.info/*'], name: 'User-Agent', value: GOOGLEBOT, targets: ['firefox'] },
  pageIdle: {
    firefox: `
      document.getElementsByClassName('jota-paywall')[0].remove();
    `,
  },

  // A string *can* interpolate module constants, unlike a function.
  isolatedStart: {
    userscript: `
      if (location.href.includes('paywall')) {
        var url = location.href.replace('www.jota.info/paywall?redirect_to=//', '');
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: { 'User-Agent': '${GOOGLEBOT}' },
          anonymous: true,
          onload: function(response) {
            var doc = new DOMParser().parseFromString(response.responseText, 'text/html');
            doc.getElementsByClassName('jota-paywall')[0].remove();
            document.open();
            history.pushState({ urlPath: url }, '', url);
            document.write(doc.documentElement.innerHTML);
            document.close();
          }
        });
      }
    `,
  },
};
