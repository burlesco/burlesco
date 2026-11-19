// The Economist. Userscript only.
export default {
  id: 'economist',
  name: 'The Economist',
  matches: ['*://www.economist.com/*'],

  userscript: {
    // Keep the article as it loaded; put it back once the regwall shows up.
    siteIdle: () => {
      var artBodyContainer = document.querySelector('article.article');
      var artBody = artBodyContainer.innerHTML;
      checkPaywall();
      function checkPaywall() {
        let paywallBox = document.querySelector('.layout-article-regwall');
        if (paywallBox) {
          artBodyContainer.innerHTML = artBody;
        } else {
          setTimeout(checkPaywall, 100);
        }
      }
    },
  },
};
