import { abrilPaywallScript, abrilUnlock } from './shared/abril.js';

export default {
  id: 'veja',
  name: 'Veja',
  matches: ['*://*.veja.abril.com.br/*'],
  blockRequests: [{ urls: [abrilPaywallScript] }],
  pageIdle: abrilUnlock,
};
