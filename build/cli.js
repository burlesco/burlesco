// `npm run build`: loads the Rules, builds in memory, writes the files.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { build } from './index.js';
import { loadRules } from './load-rules.js';

const ROOT = resolve(import.meta.dirname, '..');

try {
  // The release workflow sets BURLESCO_VERSION from the tag (#424);
  // otherwise the build uses package.json's version.
  const version = process.env.BURLESCO_VERSION || undefined;
  const files = await build(await loadRules(), { version });
  for (const [path, text] of Object.entries(files)) {
    const out = resolve(ROOT, path);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, text);
    console.log(`wrote ${path}`);
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
