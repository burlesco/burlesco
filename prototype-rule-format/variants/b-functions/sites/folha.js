export default {
  id: 'folha',
  name: 'Folha de S.Paulo',
  matches: ['*://*.folha.uol.com.br/*', '*://*.folha.com.br/*'],

  blockRequests: [{
    urls: ['*://paywall.folha.uol.com.br/*', '*://static.folha.uol.com.br/paywall/*'],
    except: ['*://paywall.folha.uol.com.br/status.php'],
  }],

  // Userscript: fake wall.json before wall.js asks for it.
  pageStart: {
    userscript: () => {
      const originalFetch = window.fetch;
      window.fetch = function (resource) {
        const url = typeof resource === 'string' ? resource : (resource && resource.url) || String(resource);
        if (url.includes('paywall.folha.uol.com.br/wall.json'))
          return Promise.resolve(new Response(JSON.stringify({ paywall: 'off', status: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        return originalFetch.apply(this, arguments);
      };
    },
  },

  // Extension: the paywall script is blocked; just reveal the text.
  pageIdle: {
    firefox: () => {
      window.omtrClickUOL = function () {};
      setTimeout(() => {
        $('#bt-read-more-content').next().show().prev().remove();
      }, 100);
    },
  },
};
