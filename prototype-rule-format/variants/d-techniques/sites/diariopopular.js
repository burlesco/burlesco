import { site, blockCookies, clearCookies, only } from '../burlesco.js';

export default site(
  { id: 'diariopopular', name: 'Diário Popular', matches: ['*://*.diariopopular.com.br/*'] },
  only('firefox', blockCookies(['*://www.diariopopular.com.br/*'])),
  only('userscript', clearCookies()),
);
