// Jornal VS (fivewall).
import { FIVEWALL } from './shared/fivewall.js';

export default {
  id: 'jornalvs',
  name: 'Jornal VS',
  // FIVEWALL is fivewall's own host, not a page of the Site. Kept so the
  // userscript's @match lines stay as they are today.
  matches: ['*://www.jornalvs.com.br/*', FIVEWALL],

  blockRequests: [{ urls: [FIVEWALL], types: ['script'] }],
};
