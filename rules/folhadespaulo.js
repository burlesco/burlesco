// Folha de S.Paulo. The two Targets get past the paywall differently today;
// converging them is separate work.
export default {
  id: 'folhadespaulo',
  name: 'Folha de S.Paulo',
  matches: ['*://*.folha.uol.com.br/*', '*://*.folha.com.br/*'],

  blockRequests: [{ urls: ['*://static.folha.uol.com.br/paywall/*'] }],

  userscript: {
    // status.php stays allowed: the page needs it to load the article.
    blockRequests: [{
      urls: ['*://paywall.folha.uol.com.br/*'],
      except: ['*://paywall.folha.uol.com.br/status.php'],
    }],

    // Fake wall.json before wall.js asks for it.
    siteStart: () => {
      const originalFetch = window.fetch;
      window.fetch = function (resource) {
        const url = typeof resource === 'string'
          ? resource
          : (resource && resource.url) || String(resource);
        if (url.includes('paywall.folha.uol.com.br/wall.json')) {
          return Promise.resolve(new Response(
            JSON.stringify({ paywall: 'off', status: 'ok' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }));
        }
        return originalFetch.apply(this, arguments);
      };
    },
  },

  firefox: {
    blockRequests: [
      { urls: ['*://paywall.folha.uol.com.br/*'], types: ['script'] },
      {
        urls: ['*://paywall.folha.uol.com.br/*'],
        except: ['*://paywall.folha.uol.com.br/status.php'],
        types: ['xmlhttprequest'],
      },
    ],

    // The paywall scripts are blocked; reveal the text.
    siteIdle: () => {
      window.omtrClickUOL = function () {};
      setTimeout(() => {
        $('#bt-read-more-content').next().show();
        $('#bt-read-more-content').next().show().prev().remove();
      }, 100);
    },
  },
};
