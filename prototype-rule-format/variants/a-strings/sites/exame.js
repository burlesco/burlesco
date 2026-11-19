import { ABRIL_UNLOCK } from './shared/abril.js';

export default {
  id: 'exame',
  name: 'Exame',
  matches: ['*://*.exame.com/*'],
  blockRequests: [{
    urls: [
      '*://exame.com/wp-content/themes/exame-new/js/pywll.js',
      '*://exame.com/wp-content/themes/exame-new/js/extd-acc.js?v=*',
    ],
  }],
  pageIdle: ABRIL_UNLOCK,
};
