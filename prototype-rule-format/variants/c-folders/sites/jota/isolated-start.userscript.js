// Userscript can't touch request headers: refetch as Googlebot instead.
if (location.href.includes('paywall')) {
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
}
