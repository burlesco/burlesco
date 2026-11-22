// Observador (tinypass). Both Targets reveal the article the same way; the
// userscript keeps doing it, the extension does it once.
import { blockTinypass } from './shared/tinypass.js';

export default {
  id: 'observador',
  name: 'Observador',
  matches: ['*://*.observador.pt/*'],

  userscript: {
    blockRequests: [{ urls: ['*://api.tinypass.com/*'] }],
    connect: ['observador.pt'],
    privilegedIdle: () => {
      setInterval(() => {
        document.querySelector('.piano-article-blocker').remove();
        document.querySelector('.article-body-wrapper').style.maxHeight = 'inherit';
        document.querySelector('.premium-article').classList.add('article-shown');
      }, 5000);
    },
  },
  firefox: {
    blockRequests: [blockTinypass],
    siteIdle: () => {
      document.querySelector('.piano-article-blocker').remove();
      document.querySelector('.article-body-wrapper').style.maxHeight = 'inherit';
      document.querySelector('.premium-article').classList.add('article-shown');
    },
  },
};
