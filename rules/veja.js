// Veja (Abril).
import { blockPaywall, unlock } from './shared/abril.js';

export default {
  id: 'veja',
  name: 'Veja',
  // The userscript's @match today. The extension's content script also
  // matched subdomains (*.veja.abril.com.br); see the gate record.
  matches: ['*://veja.abril.com.br/*'],

  siteIdle: unlock,

  userscript: { blockRequests: [blockPaywall.userscript] },
  firefox: { blockRequests: [blockPaywall.firefox] },
};
