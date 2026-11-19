// Seam 1: the whole build, in memory. A Target section adds to the top
// level and never replaces it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from '../build/index.js';
import { runUserscript } from './support/fake-page.js';

const rule = {
  id: 'alpha',
  name: 'Alpha',
  matches: ['*://alpha.com/*'],
  blockRequests: [{ urls: ['*://alpha.com/top.js'] }],
  siteStart: () => {
    document.burlesco('top-level');
  },
  userscript: {
    blockRequests: [{ urls: ['*://alpha.com/section.js'] }],
    siteStart: () => {
      document.burlesco('userscript section');
    },
  },
  firefox: {
    blockRequests: [{ urls: ['*://alpha.com/firefox.js'] }],
    siteStart: () => {
      document.burlesco('firefox section');
    },
  },
};

test('top-level and section code for the same key both run, top level first', async () => {
  const files = await build([rule]);
  const { log } = runUserscript(files['dist/burlesco.user.js'], 'https://alpha.com/');
  assert.deepEqual(log, ['top-level @start', 'userscript section @start']);
});

test('request blocks from the top level and the section are both kept', async () => {
  const files = await build([rule]);
  const line = files['dist/burlesco.user.js'].match(/^\/\/ @webRequest\s+(.*)$/m)[1];
  assert.deepEqual(JSON.parse(line).map(r => r.selector),
    ['*://alpha.com/top.js', '*://alpha.com/section.js']);
});
