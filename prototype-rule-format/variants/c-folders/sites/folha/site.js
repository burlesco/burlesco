export default {
  name: 'Folha de S.Paulo',
  matches: ['*://*.folha.uol.com.br/*', '*://*.folha.com.br/*'],
  blockRequests: [{
    urls: ['*://paywall.folha.uol.com.br/*', '*://static.folha.uol.com.br/paywall/*'],
    except: ['*://paywall.folha.uol.com.br/status.php'],
  }],
};
