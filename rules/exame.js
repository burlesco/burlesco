// Exame (Abril). Only the extension runs Abril's page code here.
import { unlock } from './shared/abril.js';

export default {
  id: 'exame',
  name: 'Exame',
  matches: ['*://*.exame.com/*'],

  blockRequests: [{
    urls: ['*://exame.com/wp-content/themes/exame-new/js/pywll.js'],
    types: ['script'],
  }],

  firefox: {
    blockRequests: [{
      urls: ['*://exame.com/wp-content/themes/exame-new/js/extd-acc.js?v=*'],
      types: ['script'],
    }],
    siteIdle: unlock,
  },
};
