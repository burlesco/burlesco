const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

export default {
  id: 'jota',
  name: 'JOTA',
  matches: ['*://*.jota.info/*'],

  // Extension: ask for the page as Googlebot, then drop the banner.
  setRequestHeader: { urls: ['*://www.jota.info/*'], name: 'User-Agent', value: GOOGLEBOT, targets: ['firefox'] },
  pageIdle: {
    firefox: () => document.getElementsByClassName('jota-paywall')[0].remove(),
  },

  // Userscript can't touch request headers: refetch as Googlebot instead.
  // Note the UA string is repeated: the function can't see GOOGLEBOT above.
  isolatedStart: {
    userscript: () => {
      if (!location.href.includes('paywall')) return;
      const url = location.href.replace('www.jota.info/paywall?redirect_to=//', '');
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
        anonymous: true,
        onload(response) {
          const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
          doc.getElementsByClassName('jota-paywall')[0].remove();
          document.open();
          history.pushState({ urlPath: url }, '', url);
          document.write(doc.documentElement.innerHTML);
          document.close();
        },
      });
    },
  },
};
