// The build's single in-memory entry point: Rules in, files out.
// Keys of the returned object are paths relative to the repo root.
import { validate } from './validate.js';
import { userscript } from './userscript.js';

export { RuleError } from './validate.js';

export async function build(rules, { version = '0.0.0' } = {}) {
  validate(rules);
  return {
    'dist/burlesco.user.js': userscript(rules, { version }),
  };
}
