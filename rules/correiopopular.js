// Correio Popular: block its fivewall paywall script.
export default {
  id: 'correiopopular',
  name: 'Correio Popular',
  matches: ['*://correio.rac.com.br/*'],

  blockRequests: [{
    urls: ['*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*'],
    types: ['script'],
  }],
};
