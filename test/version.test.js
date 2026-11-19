// Seam 1: the whole build, in memory. Without a release tag, both Targets
// carry the version the repo is at (#425). Release tags still override it
// (see release.test.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from '../build/index.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const sample = {
  id: 'sample',
  name: 'Sample',
  matches: ['*://sample.org/*'],
  removeElements: ['.wall'],
};

test('the repo is at version 15.0', () => {
  assert.equal(pkg.version, '15.0');
});

test('with no version given, both Targets carry the version in package.json', async () => {
  const files = await build([sample]);
  const userscriptVersion = files['dist/burlesco.user.js'].match(/^\/\/ @version\s+(\S+)$/m)?.[1];
  assert.equal(userscriptVersion, pkg.version);
  assert.equal(JSON.parse(files['dist/firefox/manifest.json']).version, pkg.version);
});
