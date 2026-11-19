// Diário de Canoas (fivewall). The extension blocks fivewall's requests
// here, not its scripts as for the other fivewall Sites.
import { FIVEWALL } from './shared/fivewall.js';

export default {
  id: 'diariodecanoas',
  name: 'Diário de Canoas',
  matches: ['*://*.diariodecanoas.com.br/*', FIVEWALL],

  blockRequests: [{ urls: [FIVEWALL], types: ['xmlhttprequest'] }],
};
