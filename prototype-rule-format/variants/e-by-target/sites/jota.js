export default {
  id: 'jota',
  name: 'JOTA',
  matches: ['*://*.jota.info/*'],

  firefox: {
    // Ask for the page as Googlebot, then drop the banner.
    setRequestHeader: {
      urls: ['*://www.jota.info/*'],
      name: 'User-Agent',
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
    removeElements: ['.jota-paywall'],
  },

  userscript: {
    // Can't touch request headers: refetch as Googlebot instead.
    isolatedStart: () => {
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
