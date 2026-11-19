// Seam 1: the whole build, in memory. The Firefox background script holds
// the network Techniques as data and carries them out on requests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';
import { runBackground } from './support/fake-background.js';

async function background(rules) {
  const files = await build(rules);
  return runBackground(files['dist/firefox/background.js']);
}

const alpha = {
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://*.alpha.com/*'],
  blockRequests: [{ urls: ['*://cdn.alpha.com/wall/*'] }],
  firefox: {
    blockRequests: [{
      urls: ['*://paywall.alpha.com/*'],
      except: ['*://paywall.alpha.com/status.php'],
      types: ['xmlhttprequest'],
    }],
    blockCookies: { urls: ['*://*.alpha.com/*'] },
    setRequestHeader: [{ urls: ['*://api.alpha.com/*'], name: 'Referer', value: 'https://www.google.com/' }],
  },
  userscript: { blockRequests: [{ urls: ['*://userscript-only.com/*'] }] },
};

const pageOnly = {
  id: 'pageonly',
  name: 'Page Only',
  matches: ['*://pageonly.org/*'],
  removeElements: ['.wall'],
};

test('network Techniques are data in the background, keyed by Site id', async () => {
  const bg = await background([alpha, pageOnly]);
  assert.deepEqual(JSON.parse(JSON.stringify(bg.read('NETWORK'))), {
    alpha: {
      blockRequests: [
        { urls: ['*://cdn.alpha.com/wall/*'], except: [], types: ['script', 'xmlhttprequest'] },
        {
          urls: ['*://paywall.alpha.com/*'],
          except: ['*://paywall.alpha.com/status.php'],
          types: ['xmlhttprequest'],
        },
      ],
      blockCookies: [{ urls: ['*://*.alpha.com/*'] }],
      setRequestHeader: [
        { urls: ['*://api.alpha.com/*'], name: 'Referer', value: 'https://www.google.com/' },
      ],
    },
  });
});

test('blockRequests cancels requests of its types, except the exceptions', async () => {
  const bg = await background([alpha]);
  assert.equal(bg.blocked('https://cdn.alpha.com/wall/w.js', 'script'), true);
  assert.equal(bg.blocked('https://cdn.alpha.com/wall/w.json', 'xmlhttprequest'), true);
  assert.equal(bg.blocked('https://cdn.alpha.com/wall/w.png', 'image'), false);
  assert.equal(bg.blocked('https://cdn.alpha.com/other.js', 'script'), false);
  assert.equal(bg.blocked('https://paywall.alpha.com/wall.json', 'xmlhttprequest'), true);
  assert.equal(bg.blocked('https://paywall.alpha.com/wall.js', 'script'), false);
  assert.equal(bg.blocked('http://paywall.alpha.com/status.php', 'xmlhttprequest'), false);
  assert.equal(bg.blocked('https://userscript-only.com/a.js', 'script'), false);
});

test('blockCookies strips Cookie and Set-Cookie on pages, scripts and XHR', async () => {
  const bg = await background([alpha]);
  for (const type of ['main_frame', 'script', 'xmlhttprequest']) {
    assert.deepEqual(
      bg.sentHeaders('https://www.alpha.com/a', type, { cookie: 'n=1', Accept: '*/*' }),
      { Accept: '*/*' }, type);
    assert.deepEqual(
      bg.receivedHeaders('https://www.alpha.com/a', type,
        [['Set-Cookie', 'n=1'], ['Content-Type', 'text/html']]),
      [['Content-Type', 'text/html']], type);
  }
  assert.deepEqual(bg.sentHeaders('https://www.alpha.com/a.png', 'image', { Cookie: 'n=1' }),
    { Cookie: 'n=1' });
  assert.deepEqual(bg.sentHeaders('https://other.com/', 'main_frame', { Cookie: 'n=1' }),
    { Cookie: 'n=1' });
});

test('setRequestHeader replaces or adds the header on pages and XHR', async () => {
  const bg = await background([alpha]);
  assert.equal(
    bg.sentHeaders('https://api.alpha.com/x', 'xmlhttprequest', { referer: 'https://alpha.com/' }).Referer,
    'https://www.google.com/');
  assert.equal(
    bg.sentHeaders('https://api.alpha.com/x', 'main_frame', {}).Referer,
    'https://www.google.com/');
  assert.deepEqual(bg.sentHeaders('https://api.alpha.com/x.js', 'script', {}), {});
});

test('a build with no network Techniques registers no listeners', async () => {
  const bg = await background([pageOnly]);
  assert.equal(bg.listenerCount(), 0);
});
