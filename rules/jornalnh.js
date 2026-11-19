// Jornal NH (fivewall).
import { FIVEWALL } from './shared/fivewall.js';

export default {
  id: 'jornalnh',
  name: 'Jornal NH',
  matches: ['*://www.jornalnh.com.br/*', FIVEWALL],

  blockRequests: [{ urls: [FIVEWALL], types: ['script'] }],
};
