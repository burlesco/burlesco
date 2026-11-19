// `npm run build` without a release tag: both Targets carry the version the
// repo is at (#425). Release tags still override it (see release.test.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const ROOT = resolve(import.meta.dirname, '..');

test('npm run build makes both Targets version 15.0', async () => {
  const env = { ...process.env };
  delete env.BURLESCO_VERSION;
  await promisify(execFile)(process.execPath, ['build/cli.js'], { cwd: ROOT, env });

  const userscript = await readFile(resolve(ROOT, 'dist/burlesco.user.js'), 'utf8');
  assert.match(userscript, /^\/\/ @version\s+15\.0$/m);
  const manifest = JSON.parse(
    await readFile(resolve(ROOT, 'dist/firefox/manifest.json'), 'utf8'));
  assert.equal(manifest.version, '15.0');
});
