// Used by .github/workflows/release.yml:
//   node build/release-cli.js <tag> <dir>
// Writes <dir>/firefox.json for burlesco-update and prints `version=` and
// `prerelease=` lines for $GITHUB_OUTPUT. Fails on a tag that isn't a
// signable version, before anything is built or signed.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { firefoxUpdates, releaseFor } from './release.js';

const [tag, dir] = process.argv.slice(2);
try {
  if (!tag || !dir) throw new Error('usage: release-cli.js <tag> <dir>');
  const { version, prerelease } = releaseFor(tag);
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, 'firefox.json'), firefoxUpdates(tag));
  console.log(`version=${version}\nprerelease=${prerelease}`);
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
