export default {
  id: 'gauchazh',
  name: 'GaúchaZH',
  matches: ['*://gauchazh.clicrbs.com.br/*'],
  blockRequests: [{ urls: ['*://gauchazh.clicrbs.com.br/static/signwall.*.min.js'] }],

  // Ported verbatim from both repos, including what they share.
  pageIdle: async () => {
    const data = JSON.parse(decodeURI(window.__ISOMORPHIC_DATA__)).state.apollo.ROOT_QUERY;
    const key = Object.keys(data).filter(key => key.includes('article'))[0];

    const parts = data[key].article_body_components
      .map(item => `<div class="article-paragraph">${item.html || item.data.embed}</div>`);
    const content = parts.reduce((acc, curr) => acc + curr);

    while (true) {
      const article = document.querySelector('.article-paragraph');
      if (article === null) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      article.insertAdjacentHTML('afterend', content);
      document.querySelectorAll('.article-paragraph').forEach(item => {
        item.style.opacity = '1';
      });
      document.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          return false;
        });
      });

      var style = document.createElement('style');
      style.textContent = '.paid-content-template::before { display: none; }';
      (document.head || document.documentElement).appendChild(script);

      break;
    }
  },
};
