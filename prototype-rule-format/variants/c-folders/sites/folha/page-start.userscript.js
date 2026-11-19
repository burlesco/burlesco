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
