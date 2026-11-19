// Jornal NH (fivewall).
import { FIVEWALL, FIVEWALL_MATCHES } from './shared/fivewall.js';

export default {
  id: 'jornalnh',
  name: 'Jornal NH',
  matches: ['*://www.jornalnh.com.br/*', ...FIVEWALL_MATCHES],

  blockRequests: [{ urls: [FIVEWALL], types: ['script'] }],
};
