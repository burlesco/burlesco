// Folha de Londrina: block the login check that puts up the paywall.
export default {
  id: 'folhadelondrina',
  name: 'Folha de Londrina',
  matches: ['*://*.folhadelondrina.com.br/*'],

  blockRequests: [{ urls: ['*://www.folhadelondrina.com.br/login.php*'] }],
};
