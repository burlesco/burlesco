// Seam 1: the whole build, in memory. What the build rejects.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';

const rule = (extra = {}) => ({
  id: 'sample',
  name: 'Sample Site',
  matches: ['*://*.sample.com/*'],
  ...extra,
});

const rejects = (rules, ...patterns) =>
  assert.rejects(build(rules), err => {
    for (const p of patterns) assert.match(err.message, p);
    return true;
  });

test('a clean Rule builds', async () => {
  const files = await build([rule({ removeElements: ['.paywall'] })]);
  assert.ok(files['dist/burlesco.user.js']);
});

test('an unknown key fails the build, naming the Rule and the key', () =>
  rejects([rule({ blokRequests: [] })], /sample/, /unknown key/, /blokRequests/));

test('an unknown Target section fails the build, naming it as a section', () =>
  rejects([rule({ chrome: { siteIdle: () => {} } })],
    /sample/, /unknown Target section/, /chrome/));

test('connect at the top level fails the build', () =>
  rejects([rule({ connect: ['api.sample.com'] })],
    /sample/, /connect/, /userscript section/));

test('connect in the firefox section fails the build', () =>
  rejects([rule({ firefox: { connect: ['api.sample.com'] } })],
    /sample/, /connect/, /userscript section/));

test('method shorthand in page code fails the build', () =>
  rejects([rule({ userscript: { siteIdle() { return 1; } } })],
    /sample/, /userscript\.siteIdle/, /method shorthand/));

test('page code that is not a function fails the build', () =>
  rejects([rule({ siteStart: 'document.title = ""' })],
    /sample/, /siteStart/, /function/));

test('setRequestHeader for the userscript fails the build', () =>
  rejects([rule({
    setRequestHeader: { urls: ['*://*.sample.com/*'], name: 'Referer', value: 'x' },
  })], /sample/, /userscript can't run "setRequestHeader"/));

test('blockCookies in the userscript section fails the build', () =>
  rejects([rule({ userscript: { blockCookies: { urls: ['*://*.sample.com/*'] } } })],
    /sample/, /userscript can't run "blockCookies"/));

test('blockCookies and setRequestHeader in the firefox section build', async () => {
  await build([rule({
    firefox: {
      blockCookies: { urls: ['*://*.sample.com/*'] },
      setRequestHeader: { urls: ['*://*.sample.com/*'], name: 'Referer', value: 'x' },
    },
  })]);
});

test('every Technique Firefox can run builds, in the firefox section', async () => {
  const files = await build([rule({
    firefox: {
      blockRequests: [{
        urls: ['*://*.sample.com/*'], except: ['*://*.sample.com/ok'], types: ['script'],
      }],
      blockCookies: { urls: ['*://*.sample.com/*'] },
      setRequestHeader: [{ urls: ['*://*.sample.com/*'], name: 'Referer', value: 'x' }],
      removeElements: ['.wall'],
      clearCookies: true,
      siteStart: () => {},
      siteIdle: () => {},
      privilegedStart: () => {},
      privilegedIdle: () => {},
    },
  })]);
  assert.ok(files['dist/firefox/manifest.json']);
});

test('a misspelt key inside a Technique fails the build', () =>
  rejects([rule({ blockRequests: [{ urls: ['*://a.com/*'], exept: [] }] })],
    /sample/, /unknown key "blockRequests\[0\]\.exept"/));

test('every problem in every Rule is reported at once', () =>
  rejects([rule({ foo: 1 }), rule({ id: 'other', bar: 2 })],
    /sample: unknown key "foo"/, /other: unknown key "bar"/));

test('connect in the userscript section builds', async () => {
  await build([rule({ userscript: { connect: ['api.sample.com'] } })]);
});

// The helpers the generated scripts carry live in the privileged
// environment; code injected into the page can't see them.
test('site code that calls a privileged helper fails the build, naming it', async () => {
  /* global eraseAllCookies */
  await rejects([rule({ siteIdle: () => { eraseAllCookies(); } })],
    /sample/, /"siteIdle"/, /eraseAllCookies/, /privileged/);
  await rejects([rule({ userscript: { siteStart: () => { eraseAllCookies(); } } })],
    /sample/, /"userscript\.siteStart"/, /eraseAllCookies/);
});

test('privileged code may call the helpers, and site code may use the same word otherwise', async () => {
  await build([rule({
    privilegedIdle: () => { eraseAllCookies(); },
    siteIdle: () => { document.body.dataset.eraseAllCookies = 'no'; },
  })]);
});
