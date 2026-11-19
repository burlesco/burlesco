// Jornal VS (fivewall).
import { FIVEWALL } from './shared/fivewall.js';

export default {
  id: 'jornalvs',
  name: 'Jornal VS',
  matches: ['*://www.jornalvs.com.br/*', FIVEWALL],

  blockRequests: [{ urls: [FIVEWALL], types: ['script'] }],
};
