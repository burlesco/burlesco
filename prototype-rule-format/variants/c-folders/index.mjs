// Variant C: a folder per site. site.js holds data only; code lives in plain
// script files named <slot>[.<target>].js, read from disk as text.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromSlots, TARGETS } from '../../core/ir.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const SLOTS = { 'page-start': 'pageStart', 'page-idle': 'pageIdle', 'isolated-start': 'isolatedStart', 'isolated-idle': 'isolatedIdle' };

async function readFolder(dir) {
  const rule = existsSync(join(dir, 'site.js')) ? { ...(await import(join(dir, 'site.js'))).default } : {};
  for (const file of readdirSync(dir)) {
    const m = /^([a-z-]+?)(?:\.([a-z]+))?\.js$/.exec(file);
    if (!m || !SLOTS[m[1]]) continue;
    const [, slot, target] = m;
    if (target && !TARGETS.includes(target)) throw new Error(`${dir}/${file}: unknown target "${target}"`);
    const code = readFileSync(join(dir, file), 'utf8');
    const key = SLOTS[slot];
    if (target) rule[key] = { ...(typeof rule[key] === 'object' ? rule[key] : {}), [target]: code };
    else rule[key] = code;
  }
  return rule;
}

const merge = (base, extra) => ({
  ...base, ...extra,
  blockRequests: [...(base.blockRequests ?? []), ...(extra.blockRequests ?? [])],
});

export const sites = [];
for (const id of readdirSync(join(here, 'sites')).sort()) {
  let rule = await readFolder(join(here, 'sites', id));
  for (const shared of rule.use ?? []) rule = merge(await readFolder(join(here, 'shared', shared)), rule);
  const t = fromSlots({ id, ...rule });
  // code from files is a whole script, not a value: mark it as such.
  for (const x of t.techniques) if (x.sourceKind === 'string') x.sourceKind = 'file';
  sites.push(t);
}
