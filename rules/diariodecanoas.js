// Diário de Canoas (fivewall). The extension blocks fivewall's requests
// here, not its scripts as for the other fivewall Sites.
import { FIVEWALL } from './shared/fivewall.js';

export default {
  id: 'diariodecanoas',
  name: 'Diário de Canoas',
  // FIVEWALL is fivewall's own host, not a page of the Site. Kept so the
  // userscript's @match lines stay as they are today.
  matches: ['*://*.diariodecanoas.com.br/*', FIVEWALL],

  blockRequests: [{ urls: [FIVEWALL], types: ['xmlhttprequest'] }],
};
