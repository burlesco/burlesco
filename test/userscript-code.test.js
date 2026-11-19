// Seam 1: the whole build, in memory. Where the userscript runs page code:
// at which moment, in which environment, on which Sites.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';
import { runUserscript } from './support/fake-page.js';

async function visit(rules, href) {
  const files = await build(rules);
  return runUserscript(files['dist/burlesco.user.js'], href);
}

// Each piece of page code reports its name and the environment it ran in;
// the fake page adds the moment.
const alpha = {
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://*.alpha.com/*', '*://alpha.net/news/*'],
  siteStart: () => {
    document.burlesco('siteStart in ' + (window.siteMarker ? 'site' : 'privileged'));
  },
  siteIdle: () => {
    document.burlesco('siteIdle in ' + (window.siteMarker ? 'site' : 'privileged'));
  },
  privilegedStart: () => {
    document.burlesco('privilegedStart in ' + (window.siteMarker ? 'site' : 'privileged'));
  },
  privilegedIdle: () => {
    document.burlesco('privilegedIdle in ' + (window.siteMarker ? 'site' : 'privileged'));
  },
};

const beta = {
  id: 'beta',
  name: 'Beta',
  matches: ['*://beta.org/*'],
  siteStart: () => {
    document.burlesco('beta');
  },
};

test('each kind of page code runs at its moment, in its environment', async () => {
  const { log } = await visit([alpha], 'https://www.alpha.com/story');
  assert.deepEqual(log.sort(), [
    'privilegedIdle in privileged @idle',
    'privilegedStart in privileged @start',
    'siteIdle in site @idle',
    'siteStart in site @start',
  ]);
});

test("page code runs only on the Site's matches", async () => {
  assert.deepEqual((await visit([alpha, beta], 'http://beta.org/x')).log, ['beta @start']);
  assert.equal((await visit([alpha], 'https://alpha.com/')).log.length, 4);
  assert.equal((await visit([alpha], 'https://alpha.net/news/1')).log.length, 4);
  assert.deepEqual((await visit([alpha], 'https://alpha.net/about')).log, []);
  assert.deepEqual((await visit([alpha], 'https://notalpha.com/')).log, []);
  assert.deepEqual((await visit([alpha], 'https://alpha.com.evil.org/')).log, []);
});

test('removeElements and clearCookies run after the page has loaded', async () => {
  const rule = {
    id: 'gamma',
    name: 'Gamma',
    matches: ['*://gamma.org/*'],
    removeElements: ['.wall', '#overlay'],
    userscript: { clearCookies: true },
  };
  const { removed, cookieWrites } = await visit([rule], 'https://gamma.org/a/b');
  const selectors = removed.flatMap(s => s.split(/\s*,\s*/));
  assert.deepEqual(selectors.sort(), ['#overlay', '.wall']);
  assert.ok(cookieWrites.some(w => /^a=;.*expires=Thu, 01-Jan-1970/.test(w)));
  assert.ok(cookieWrites.some(w => /^b=;.*domain=gamma\.org/.test(w)));
});

// The old userscript's eraseAllCookies (burlesco/userscript v14.2,
// src/burlesco.user.js:490-534): last cookie first, every path prefix, and
// the host, the host without www. and the registrable domain.
test('clearCookies expires each cookie exactly as the old userscript did', async () => {
  const rule = {
    id: 'gamma',
    name: 'Gamma',
    matches: ['*://*.gamma.org/*'],
    userscript: { clearCookies: true },
  };
  const { cookieWrites } = await visit([rule], 'https://www.news.gamma.org/a/b');
  const expired = '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
  const forCookie = name => ['', '; path=/', '; path=/a', '; path=/a/b'].flatMap(path => [
    `${name}=${path}${expired}`,
    `${name}=${path}; domain=www.news.gamma.org${expired}`,
    `${name}=${path}; domain=news.gamma.org${expired}`,
    `${name}=${path}; domain=gamma.org${expired}`,
  ]);
  assert.deepEqual(cookieWrites, [...forCookie('b'), ...forCookie('a')]);
});

test('page code stays readable in the output', async () => {
  const files = await build([beta]);
  assert.match(files['dist/burlesco.user.js'], /document\.burlesco\('beta'\);/);
});
