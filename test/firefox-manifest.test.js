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

test('the extension ships the license, as today', async () => {
  const files = await build([alpha]);
  assert.match(String(files['dist/firefox/LICENSE.txt']), /^The MIT License \(MIT\)/);
});

test('host permissions cover every URL a Firefox network Technique uses, once', async () => {
  const m = await manifest([alpha, beta]);
  const hosts = m.permissions.filter(p => p.includes('://'));
  for (const url of [
    '*://*.alpha-cdn.net/*',
    '*://*.tinypass.com/*',
    '*://api.alpha.com/*',
    '*://paywall.alpha.com/*',
  ]) {
    assert.equal(hosts.filter(h => h === url).length, 1, url);
  }
  assert.ok(!hosts.includes('*://userscript-only.com/*'));
  for (const p of ['webRequest', 'webRequestBlocking']) {
    assert.ok(m.permissions.includes(p), p);
  }
});

// Requests a Site's own pages start keep the permission today's extension
// gives them for the whole Site.
test('host permissions also cover the pages of every Site with Firefox network Techniques', async () => {
  const pageOnly = {
    id: 'pageonly',
    name: 'Page Only',
    matches: ['*://pageonly.org/*'],
    siteIdle: () => {},
  };
  const userscriptNetwork = {
    id: 'usnet',
    name: 'Userscript Network',
    matches: ['*://usnet.org/*'],
    userscript: { blockRequests: [{ urls: ['*://cdn.usnet.org/*'] }] },
  };
  const m = await manifest([alpha, beta, pageOnly, userscriptNetwork]);
  assert.deepEqual(m.permissions.filter(p => p.includes('://')), [
    '*://*.alpha-cdn.net/*',
    '*://*.alpha.com/*',
    '*://*.tinypass.com/*',
    '*://api.alpha.com/*',
    '*://beta.org/*',
    '*://paywall.alpha.com/*',
  ]);
});

test('a Rule with no network Techniques asks for no host permissions', async () => {
  const m = await manifest([{ id: 'gamma', name: 'Gamma', matches: ['*://gamma.org/*'] }]);
  assert.deepEqual(m.permissions.filter(p => p.includes('://')), []);
});

test('the manifest opens the generated options page and may use storage', async () => {
  const files = await build([alpha]);
  const m = JSON.parse(files['dist/firefox/manifest.json']);
  assert.ok(files[`dist/firefox/${m.options_ui.page}`]);
  assert.ok(m.permissions.includes('storage'));
});
