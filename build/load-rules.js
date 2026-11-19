// Loads every Rule from the rules directory: one module per Site, named
// after its id. Subdirectories (rules/shared/) hold code Rules import and
// are not Rules themselves.
import { readdir } from 'node:fs/promises';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

export const RULES_DIR = resolve(import.meta.dirname, '..', 'rules');

export async function loadRules(dir = RULES_DIR) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile() && e.name.endsWith('.js'))
    .map(e => e.name)
    .sort();
  const rules = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(dir, file)).href);
    const rule = mod.default;
    const id = basename(file, '.js');
    if (rule === undefined) {
      throw new Error(`rules/${file}: a Rule must be the module's default export`);
    }
    if (rule.id !== id) {
      throw new Error(`rules/${file}: the file name must be the Rule's id ("${rule.id}")`);
    }
    rules.push(rule);
  }
  return rules;
}
