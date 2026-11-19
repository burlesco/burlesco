// The build's single in-memory entry point: Rules in, files out.
// Keys of the returned object are paths relative to the repo root.
//
// 1. Validate every Rule; nothing is generated if one is wrong.
// 2. Generate each Target's files.
// 3. Lint the generated scripts; any finding fails the build.
import { validate } from './validate.js';
import { userscript } from './userscript.js';
import { firefox } from './firefox.js';
import { lintOutput } from './lint-output.js';

export { RuleError } from './validate.js';
export { OutputLintError } from './lint-output.js';

const USERSCRIPT = 'dist/burlesco.user.js';

export async function build(rules, { version = '0.0.0' } = {}) {
  validate(rules);
  const files = {
    [USERSCRIPT]: userscript(rules, { version }),
    ...firefox(rules, { version }),
  };
  await lintOutput([{ path: USERSCRIPT, text: files[USERSCRIPT], target: 'userscript' }]);
  return files;
}
