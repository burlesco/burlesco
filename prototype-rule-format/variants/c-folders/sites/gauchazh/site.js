export default {
  name: 'GaúchaZH',
  matches: ['*://gauchazh.clicrbs.com.br/*'],
  blockRequests: [{ urls: ['*://gauchazh.clicrbs.com.br/static/signwall.*.min.js'] }],
};
