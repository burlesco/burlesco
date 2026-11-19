import { site, blockRequests } from '../burlesco.js';
import { abrilUnlock } from './shared/abril.js';

export default site(
  { id: 'exame', name: 'Exame', matches: ['*://*.exame.com/*'] },
  blockRequests([
    '*://exame.com/wp-content/themes/exame-new/js/pywll.js',
    '*://exame.com/wp-content/themes/exame-new/js/extd-acc.js?v=*',
  ]),
  abrilUnlock,
);
