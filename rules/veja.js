// Veja (Abril).
import { blockPaywall, unlock } from './shared/abril.js';

export default {
  id: 'veja',
  name: 'Veja',
  matches: ['*://*.veja.abril.com.br/*'],

  siteIdle: unlock,

  userscript: { blockRequests: [blockPaywall.userscript] },
  firefox: { blockRequests: [blockPaywall.firefox] },
};
