// Época (Globo). Extension only.
import { noPaywall } from './shared/globo.js';

export default {
  id: 'epoca',
  name: 'Época',
  matches: ['*://*.epoca.globo.com/*'],

  firefox: { siteStart: noPaywall },
};
