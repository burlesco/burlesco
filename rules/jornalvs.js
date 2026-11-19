// Jornal VS (fivewall).
import { FIVEWALL, FIVEWALL_MATCHES } from './shared/fivewall.js';

export default {
  id: 'jornalvs',
  name: 'Jornal VS',
  matches: ['*://www.jornalvs.com.br/*', ...FIVEWALL_MATCHES],

  blockRequests: [{ urls: [FIVEWALL], types: ['script'] }],
};
