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

test('Firefox page code that uses a module variable fails the build', () =>
  assert.rejects(
    build([rule({
      firefox: {
        siteIdle: () => {
          document.querySelector(SELECTOR).remove();
        },
      },
    })]),
    err => {
      assert.match(err.message, /dist\/firefox\/content-idle\.js/);
      assert.match(err.message, /'SELECTOR' is not defined/);
      return true;
    }));

test("Firefox page code can't call userscript APIs", () =>
  assert.rejects(
    build([rule({
      firefox: {
        privilegedStart: () => {
          GM_xmlhttpRequest({ url: location.href });
        },
      },
    })]),
    /dist\/firefox\/content-start\.js.*'GM_xmlhttpRequest' is not defined/));

test('Firefox output that uses only page and extension globals builds', async () => {
  await build([rule({
    blockRequests: [{ urls: ['*://alpha.com/wall.js'], except: ['*://alpha.com/ok.js'] }],
    firefox: {
      blockCookies: { urls: ['*://alpha.com/*'] },
      setRequestHeader: { urls: ['*://alpha.com/*'], name: 'Referer', value: 'x' },
      siteStart: () => {
        window.$('.paywall').remove();
      },
      privilegedIdle: () => {
        browser.runtime.sendMessage('hi');
      },
      removeElements: ['.wall'],
      clearCookies: true,
    },
  })]);
});
