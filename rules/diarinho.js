// Diarinho: block the admin-ajax call that checks the reader's access.
export default {
  id: 'diarinho',
  name: 'Diarinho',
  matches: ['*://*.diarinho.com.br/*'],

  blockRequests: [{
    urls: ['*://*.diarinho.com.br/wp-admin/admin-ajax.php'],
    types: ['xmlhttprequest'],
  }],

  userscript: {
    // Already covered by *.diarinho.com.br; kept so the header stays the same.
    blockRequests: [{ urls: ['*://diarinho.com.br/wp-admin/admin-ajax.php'] }],
  },
};
