// Quatro Rodas (Abril). Only the userscript runs Abril's page code here.
import { blockPaywall, unlock } from './shared/abril.js';

export default {
  id: 'quatrorodas',
  name: 'Quatro Rodas',
  matches: ['*://quatrorodas.abril.com.br/*'],

  userscript: {
    blockRequests: [blockPaywall.userscript],
    siteIdle: unlock,
  },
  firefox: { blockRequests: [blockPaywall.firefox] },
};
