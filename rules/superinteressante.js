// Superinteressante (Abril).
import { blockPaywall, unlock } from './shared/abril.js';

export default {
  id: 'superinteressante',
  name: 'Superinteressante',
  matches: ['*://super.abril.com.br/*'],

  siteIdle: unlock,

  userscript: { blockRequests: [blockPaywall.userscript] },
  firefox: { blockRequests: [blockPaywall.firefox] },
};
