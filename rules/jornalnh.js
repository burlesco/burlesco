// Jornal NH (fivewall).
import { FIVEWALL } from './shared/fivewall.js';

export default {
  id: 'jornalnh',
  name: 'Jornal NH',
  // FIVEWALL is fivewall's own host, not a page of the Site. Kept so the
  // userscript's @match lines stay as they are today.
  matches: ['*://www.jornalnh.com.br/*', FIVEWALL],

  blockRequests: [{ urls: [FIVEWALL], types: ['script'] }],
};
