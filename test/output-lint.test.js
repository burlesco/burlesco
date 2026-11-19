// Seam 1: the whole build, in memory. The build lints its own output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';

const SELECTOR = '.paywall';

const rule = extra => ({
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://alpha.com/*'],
  ...extra,
});

test('page code that uses a module variable fails the build', () =>
  assert.rejects(
    build([rule({
      siteIdle: () => {
        document.querySelector(SELECTOR).remove();
      },
    })]),
    err => {
      assert.match(err.message, /burlesco\.user\.js/);
      assert.match(err.message, /'SELECTOR' is not defined/);
      return true;
    }));

test('page code that uses only page and userscript globals builds', async () => {
  await build([rule({
    siteIdle: () => {
      window.$('.paywall').remove();
      localStorage.clear();
    },
    userscript: {
      privilegedStart: () => {
        GM_xmlhttpRequest({ url: location.href });
      },
    },
  })]);
});
