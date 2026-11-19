// Seam 1: the whole build, in memory. The Firefox options page, where a
// person switches Sites on and off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';
import { openOptions } from './support/fake-options.js';

const open = async (rules, stored) => openOptions(await build(rules), stored);

const alpha = {
  id: 'alpha',
  name: 'Alpha & Sons',
  matches: ['*://*.alpha.com/*'],
  blockRequests: [{ urls: ['*://cdn.alpha.com/wall/*'] }],
};

const beta = {
  id: 'beta',
  name: 'Beta',
  matches: ['*://beta.org/*'],
  firefox: { siteIdle: () => {} },
};

// Nothing for Firefox: not on its options page.
const userscriptOnly = {
  id: 'userscriptonly',
  name: 'Userscript Only',
  matches: ['*://us.org/*'],
  userscript: { siteIdle: () => {} },
};

const bare = { id: 'bare', name: 'Bare', matches: ['*://bare.org/*'] };

const listed = page => page.switches().map(({ id, name }) => ({ id, name }));

test('the options page lists exactly the Sites with Firefox Techniques, by id and name', async () => {
  const page = await open([beta, userscriptOnly, alpha, bare]);
  assert.deepEqual(listed(page).sort((a, b) => a.id.localeCompare(b.id)), [
    { id: 'alpha', name: 'Alpha & Sons' },
    { id: 'beta', name: 'Beta' },
  ]);
});

test('choices saved in today\'s format show as saved; Sites with none show on', async () => {
  const page = await open([alpha, beta, bare], { sites: { alpha: false, oldsite: false } });
  assert.deepEqual(page.switches().map(({ id, checked }) => [id, checked]).sort(),
    [['alpha', false], ['beta', true]]);
  assert.deepEqual((await open([alpha])).switches().map(s => s.checked), [true]);
});

test('saving stores every switch in today\'s format and tells the extension', async () => {
  const page = await open([alpha, beta], { sites: { alpha: false } });
  page.set('alpha', true);
  page.set('beta', false);
  await page.click('save');
  assert.deepEqual(page.storage, { sites: { alpha: true, beta: false } });
  assert.deepEqual(page.messages, ['update']);
});

test('the page can switch every Site on or off at once before saving', async () => {
  const page = await open([alpha, beta], { sites: { alpha: false } });
  await page.click('all');
  assert.deepEqual(page.switches().map(s => s.checked), [true, true]);
  await page.click('none');
  assert.deepEqual(page.switches().map(s => s.checked), [false, false]);
  assert.deepEqual(page.messages, []);
});
