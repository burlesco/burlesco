// Seam 1: the whole build, in memory. The Firefox extension's manifest.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';

async function manifest(rules, options) {
  const files = await build(rules, options);
  return JSON.parse(files['dist/firefox/manifest.json']);
}

const alpha = {
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://*.alpha.com/*'],
  blockRequests: [{
    urls: ['*://paywall.alpha.com/*'],
    except: ['*://paywall.alpha.com/status'],
  }],
  firefox: {
    blockCookies: { urls: ['*://*.alpha-cdn.net/*'] },
    setRequestHeader: { urls: ['*://api.alpha.com/*'], name: 'Referer', value: 'x' },
  },
};

const beta = {
  id: 'beta',
  name: 'Beta',
  matches: ['*://beta.org/*'],
  blockRequests: [{ urls: ['*://*.tinypass.com/*', '*://paywall.alpha.com/*'] }],
  userscript: { blockRequests: [{ urls: ['*://userscript-only.com/*'] }] },
};

test('the manifest is an MV2 extension that updates from burlesco-update', async () => {
  const m = await manifest([alpha], { version: '15.0' });
  assert.equal(m.manifest_version, 2);
  assert.equal(m.name, 'burlesco');
  assert.equal(m.version, '15.0');
  assert.deepEqual(m.browser_specific_settings.gecko, {
    id: 'burlesco@burles.co',
    update_url: 'https://burlesco.github.io/burlesco-update/firefox.json',
  });
  assert.deepEqual(m.background.scripts, ['background.js']);
});

test('the extension ships the icon its manifest names', async () => {
  const files = await build([alpha]);
  const m = JSON.parse(files['dist/firefox/manifest.json']);
  const icon = files[`dist/firefox/${m.icons['128']}`];
  assert.ok(Buffer.isBuffer(icon));
  assert.equal(icon.subarray(1, 4).toString(), 'PNG');
});

test('host permissions cover every URL a Firefox network Technique uses, once', async () => {
  const m = await manifest([alpha, beta]);
  const hosts = m.permissions.filter(p => p.includes('://'));
  assert.deepEqual(hosts.sort(), [
    '*://*.alpha-cdn.net/*',
    '*://*.tinypass.com/*',
    '*://api.alpha.com/*',
    '*://paywall.alpha.com/*',
  ]);
  for (const p of ['webRequest', 'webRequestBlocking']) {
    assert.ok(m.permissions.includes(p), p);
  }
});

test('a Rule with no network Techniques asks for no host permissions', async () => {
  const m = await manifest([{ id: 'gamma', name: 'Gamma', matches: ['*://gamma.org/*'] }]);
  assert.deepEqual(m.permissions.filter(p => p.includes('://')), []);
});
