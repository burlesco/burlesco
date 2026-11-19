// Casa e Jardim (Globo). Extension only.
import { noPaywall } from './shared/globo.js';

export default {
  id: 'casaejardim',
  name: 'Casa e Jardim',
  matches: ['*://*.revistacasaejardim.globo.com/*'],

  firefox: { siteStart: noPaywall },
};
