import { site, blockRequests, inPage, only } from '../burlesco.js';

export default site(
  { id: 'folha', name: 'Folha de S.Paulo', matches: ['*://*.folha.uol.com.br/*', '*://*.folha.com.br/*'] },

  blockRequests(['*://paywall.folha.uol.com.br/*', '*://static.folha.uol.com.br/paywall/*'], {
    except: ['*://paywall.folha.uol.com.br/status.php'],
  }),

  only('userscript', inPage('start', () => {
    // Fake wall.json before wall.js asks for it.
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
  })),

  only('firefox', inPage('idle', () => {
    // The paywall script is blocked; just reveal the text.
    window.omtrClickUOL = function () {};
    setTimeout(() => {
      $('#bt-read-more-content').next().show().prev().remove();
    }, 100);
  })),
);
