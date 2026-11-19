// Seam 1: the whole build, in memory. The userscript's metadata block.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';

const LATEST =
  'https://github.com/burlesco/burlesco/releases/latest/download/burlesco.user.js';

async function header(rules, options) {
  const files = await build(rules, options);
  const text = files['dist/burlesco.user.js'];
  const block = text.split('// ==/UserScript==')[0];
  assert.ok(block.startsWith('// ==UserScript==\n'));
  const entries = [...block.matchAll(/^\/\/ @(\S+)(?:[ \t]+(.*))?$/gm)]
    .map(m => [m[1], m[2] ?? '']);
  return {
    all: key => entries.filter(([k]) => k === key).map(([, v]) => v),
    one: key => {
      const values = entries.filter(([k]) => k === key).map(([, v]) => v);
      assert.equal(values.length, 1, `exactly one @${key}`);
      return values[0];
    },
  };
}

test('the header keeps the note asking people to clear the cache', async () => {
  const files = await build([alpha]);
  assert.match(files['dist/burlesco.user.js'],
    /^\/\/ @icon .*\n\/\/ Atenção:\s+Caso algum site não funcione logo após a instalação, limpe o cache do navegador\.$/m);
});

const alpha = {
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://*.alpha.com/*', '*://alpha.net/*'],
  blockRequests: [
    { urls: ['*://paywall.alpha.com/*'], except: ['*://paywall.alpha.com/ok.php'] },
  ],
  userscript: {
    blockRequests: [{ urls: ['*://cdn.alpha.com/wall.js', '*://cdn.alpha.com/w2.js'] }],
    connect: ['api.alpha.com'],
    privilegedStart: () => {
      GM_xmlhttpRequest({ method: 'GET', url: 'https://api.alpha.com/' });
    },
  },
};

const beta = {
  id: 'beta',
  name: 'Beta',
  matches: ['*://beta.org/*'],
  siteIdle: () => {
    document.body.classList.remove('locked');
  },
};

// Firefox only: the userscript has nothing to do for it.
const gamma = {
  id: 'gamma',
  name: 'Gamma',
  matches: ['*://gamma.org/*'],
  firefox: { blockCookies: { urls: ['*://gamma.org/*'] } },
};

test('@match lists every Site the userscript has Techniques for', async () => {
  const h = await header([alpha, beta, gamma]);
  assert.deepEqual(h.all('match'),
    ['*://*.alpha.com/*', '*://alpha.net/*', '*://beta.org/*']);
});

// A Site the userscript only @matches: it has a userscript section but no
// Techniques (#422).
const delta = {
  id: 'delta',
  name: 'Delta',
  matches: ['*://*.delta.co.uk/*'],
  userscript: {},
};

test('@match lists a Site whose userscript section is empty', async () => {
  const h = await header([beta, delta, gamma]);
  assert.deepEqual(h.all('match'), ['*://beta.org/*', '*://*.delta.co.uk/*']);
});

test('@connect lists every host from the userscript sections', async () => {
  const h = await header([alpha, beta]);
  assert.deepEqual(h.all('connect'), ['api.alpha.com']);
});

test('a single @webRequest line carries every userscript request block', async () => {
  const h = await header([alpha, beta, gamma]);
  assert.deepEqual(JSON.parse(h.one('webRequest')), [
    {
      selector: { include: '*://paywall.alpha.com/*', exclude: '*://paywall.alpha.com/ok.php' },
      action: 'cancel',
    },
    { selector: '*://cdn.alpha.com/wall.js', action: 'cancel' },
    { selector: '*://cdn.alpha.com/w2.js', action: 'cancel' },
  ]);
});

test('a request block shared by several Sites is in @webRequest once', async () => {
  const shared = { urls: ['*://*.vendor.com/wall.js'] };
  const one = { id: 'one', name: 'One', matches: ['*://one.com/*'], blockRequests: [shared] };
  const two = { id: 'two', name: 'Two', matches: ['*://two.com/*'], blockRequests: [shared] };
  const h = await header([one, two]);
  assert.deepEqual(JSON.parse(h.one('webRequest')), [
    { selector: '*://*.vendor.com/wall.js', action: 'cancel' },
  ]);
});

test('@webRequest is emitted even with no request blocks', async () => {
  const h = await header([beta]);
  assert.deepEqual(JSON.parse(h.one('webRequest')), []);
});

test('grants cover request blocking and the GM_ APIs privileged code uses', async () => {
  assert.deepEqual((await header([alpha])).all('grant'),
    ['GM_webRequest', 'GM_xmlhttpRequest']);
  assert.deepEqual((await header([beta])).all('grant'), ['GM_webRequest']);
});

test('the script runs at document-start, once per page', async () => {
  const h = await header([beta]);
  assert.equal(h.one('run-at'), 'document-start');
  assert.deepEqual(h.all('noframes'), ['']);
});

test("update URLs point at this repo's latest release", async () => {
  const h = await header([beta]);
  assert.equal(h.one('updateURL'), LATEST);
  assert.equal(h.one('downloadURL'), LATEST);
});

test('name and version', async () => {
  const h = await header([beta], { version: '15.0' });
  assert.equal(h.one('name'), 'Burlesco');
  assert.equal(h.one('version'), '15.0');
});
