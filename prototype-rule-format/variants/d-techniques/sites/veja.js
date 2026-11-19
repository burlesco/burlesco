import { site } from '../burlesco.js';
import { abrilPaywall, abrilUnlock } from './shared/abril.js';

export default site(
  { id: 'veja', name: 'Veja', matches: ['*://*.veja.abril.com.br/*'] },
  abrilPaywall,
  abrilUnlock,
);
