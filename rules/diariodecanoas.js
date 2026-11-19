// Diário de Canoas (fivewall). The extension blocks fivewall's requests
// here, not its scripts as for the other fivewall Sites.
import { FIVEWALL, FIVEWALL_MATCHES } from './shared/fivewall.js';

export default {
  id: 'diariodecanoas',
  name: 'Diário de Canoas',
  matches: ['*://*.diariodecanoas.com.br/*', ...FIVEWALL_MATCHES],

  blockRequests: [{ urls: [FIVEWALL], types: ['xmlhttprequest'] }],
};
