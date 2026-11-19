// Haaretz, on both of its domains. Userscript only.
export default {
  id: 'haaretz',
  name: 'Haaretz',
  matches: ['*://*.haaretz.com/*', '*://*.haaretz.co.il/*'],

  userscript: {
    blockRequests: [{
      urls: ['*://*.haaretz.co.il/*/inter.js', '*://*.themarker.com/*/inter.js'],
    }],

    // Refetch the page as Googlebot and show that instead.
    privilegedIdle: () => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: window.location.href,
        headers: {
          'User-Agent': 'Googlebot/2.1 (+http://www.googlebot.com/bot.html)'
        },
        anonymous: true,
        onload: function (response) {
          var parser = new DOMParser();
          var newDocument = parser.parseFromString(response.responseText, 'text/html');
          if (newDocument) {
            document.open();
            document.write(newDocument.getElementsByTagName('html')[0].innerHTML);
            document.close();
          }
        }
      });
    },
  },
};
