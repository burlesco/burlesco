// Seam 1: the whole build, in memory. Where the Firefox extension runs page
// code: which Sites get a content script at which moment, and what runs on
// each page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';
import { runContentScripts } from './support/fake-page.js';

async function visit(rules, href, stored) {
  return runContentScripts(await build(rules), href, stored);
}

const contentScripts = async rules =>
  JSON.parse((await build(rules))['dist/firefox/manifest.json']).content_scripts ?? [];

const matchesAt = (scripts, runAt) =>
  scripts.filter(cs => cs.run_at === runAt).flatMap(cs => cs.matches).sort();

// Each piece of page code reports its name and the environment it ran in;
// the fake page adds the moment.
const alpha = {
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://*.alpha.com/*'],
  siteStart: () => {
    document.burlesco('siteStart in ' + (window.siteMarker ? 'site' : 'privileged'));
  },
  firefox: {
    siteIdle: () => {
      document.burlesco('siteIdle in ' + (window.siteMarker ? 'site' : 'privileged'));
    },
    privilegedStart: () => {
      document.burlesco('privilegedStart in ' + (window.siteMarker ? 'site' : 'privileged'));
    },
    privilegedIdle: () => {
      document.burlesco('privilegedIdle in ' + (window.siteMarker ? 'site' : 'privileged'));
    },
  },
};

// Start code only, so it has no idle content script.
const beta = {
  id: 'beta',
  name: 'Beta',
  matches: ['*://beta.org/*', '*://*.beta.net/*'],
  siteStart: () => {
    document.burlesco('beta');
  },
};

// Idle Techniques that aren't code.
const gamma = {
  id: 'gamma',
  name: 'Gamma',
  matches: ['*://gamma.org/*'],
  firefox: { removeElements: ['.wall', '#overlay'], clearCookies: true },
};

// Code for the userscript only, and network Techniques: no content script.
const delta = {
  id: 'delta',
  name: 'Delta',
  matches: ['*://delta.org/*'],
  blockRequests: [{ urls: ['*://delta.org/wall.js'] }],
  userscript: { siteIdle: () => {} },
};

test('content scripts are registered only for the Sites with code at that moment', async () => {
  const scripts = await contentScripts([alpha, beta, gamma, delta]);
  assert.deepEqual(matchesAt(scripts, 'document_start'),
    ['*://*.alpha.com/*', '*://*.beta.net/*', '*://beta.org/*']);
  assert.deepEqual(matchesAt(scripts, 'document_idle'),
    ['*://*.alpha.com/*', '*://gamma.org/*']);
});

test('no content script is registered for a moment no Site has code at', async () => {
  assert.deepEqual(await contentScripts([delta]), []);
  assert.deepEqual(matchesAt(await contentScripts([beta]), 'document_idle'), []);
});

test('each kind of page code runs at its moment, in its environment', async () => {
  const { log } = await visit([alpha], 'https://www.alpha.com/story');
  assert.deepEqual(log.sort(), [
    'privilegedIdle in privileged @idle',
    'privilegedStart in privileged @start',
    'siteIdle in site @idle',
    'siteStart in site @start',
  ]);
});

test("a Site's code is gated by its matches, even where the script is loaded", async () => {
  // One start script serves alpha and beta: on beta's pages only beta runs.
  assert.deepEqual((await visit([alpha, beta], 'https://www.beta.net/x')).log, ['beta @start']);
  assert.deepEqual((await visit([alpha, beta], 'https://beta.org/x')).log, ['beta @start']);
  assert.equal((await visit([alpha, beta], 'https://alpha.com/')).log.length, 4);
  assert.deepEqual((await visit([alpha, beta], 'https://alpha.com.evil.org/')).log, []);
});

test('removeElements and clearCookies run after the page has loaded', async () => {
  const { removed, cookieWrites } = await visit([gamma], 'https://gamma.org/a/b');
  const selectors = removed.flatMap(s => s.split(/\s*,\s*/));
  assert.deepEqual(selectors.sort(), ['#overlay', '.wall']);
  assert.ok(cookieWrites.some(w => /^a=;.*expires=Thu, 01-Jan-1970/.test(w)));
  assert.ok(cookieWrites.some(w => /^b=;.*domain=gamma\.org/.test(w)));
});

test('a Site switched off in the options page runs none of its page code', async () => {
  const off = { sites: { alpha: false, gamma: false } };
  assert.deepEqual((await visit([alpha, beta], 'https://www.alpha.com/', off)).log, []);
  const g = await visit([gamma], 'https://gamma.org/a', off);
  assert.deepEqual([g.removed, g.cookieWrites], [[], []]);
  assert.deepEqual((await visit([alpha, beta], 'https://beta.org/', off)).log, ['beta @start']);
});

test('a Site switched back on runs its page code again', async () => {
  const on = { sites: { alpha: true } };
  assert.equal((await visit([alpha], 'https://www.alpha.com/', on)).log.length, 4);
});
