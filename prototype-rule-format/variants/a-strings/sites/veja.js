import { abrilPaywallScript, ABRIL_UNLOCK } from './shared/abril.js';

export default {
  id: 'veja',
  name: 'Veja',
  matches: ['*://*.veja.abril.com.br/*'],
  blockRequests: [{ urls: [abrilPaywallScript] }],
  pageIdle: ABRIL_UNLOCK,
};
