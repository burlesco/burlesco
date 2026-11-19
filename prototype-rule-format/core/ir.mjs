// PROTOTYPE, throwaway. The IR every authoring format compiles to.
// The emitters only ever see this shape, so the authoring format is a
// surface choice; this IR is the real contract between rules and targets.
//
// Site      { id, name, matches: MatchPattern[], techniques: Technique[] }
// Technique { kind, targets: Target[], ...fields }
//
//   network (run by the browser, before the page sees anything)
//     blockRequests     { urls, except, types }
//     blockCookies      { urls }                  strip Cookie / Set-Cookie
//     setRequestHeader  { urls, name, value }
//
//   page-side (run inside the tab)
//     code              { at: 'start'|'idle', world: 'page'|'isolated',
//                         sourceKind: 'string'|'function'|'file', source }
//     removeElements    { at, selectors }         declarative cosmetic
//     clearCookies      { at }                    via document.cookie

export const TARGETS = ['userscript', 'firefox'];

export function technique(kind, fields, targets = TARGETS) {
  for (const t of targets)
    if (!TARGETS.includes(t)) throw new Error(`unknown target "${t}"`);
  return { kind, targets: [...targets], ...fields };
}

// A JS value that is page code: a string (variant A), a function (B, D) or
// file contents (C) all become { sourceKind, source }.
export function toSource(value, where) {
  if (typeof value === 'string') return { sourceKind: 'string', source: value };
  if (typeof value === 'function') {
    const src = value.toString();
    // `pageIdle() {...}` (method shorthand) stringifies to something that is
    // not an expression, so it cannot be injected as `(src)()`.
    if (!/^(async\s+)?(function\b|\(|[A-Za-z_$][\w$]*\s*=>)/.test(src))
      throw new Error(`${where}: method shorthand can't be serialized; use an arrow or function expression`);
    return { sourceKind: 'function', source: src };
  }
  throw new Error(`${where}: page code must be a string or a function`);
}

// Variants A and B share one authoring shape: an object with fixed slots
// (the YAML shape from the issue, in JS). A code slot is either one value for
// every target, or { userscript: value, firefox: value }.
const CODE_SLOTS = {
  pageStart: { at: 'start', world: 'page' },
  pageIdle: { at: 'idle', world: 'page' },
  isolatedStart: { at: 'start', world: 'isolated' },
  isolatedIdle: { at: 'idle', world: 'isolated' },
};

function perTarget(value) {
  if (typeof value === 'string' || typeof value === 'function') return [[TARGETS, value]];
  return Object.entries(value).map(([target, v]) => [[target], v]);
}

export function fromSlots(rule) {
  const out = [];
  for (const b of rule.blockRequests ?? [])
    out.push(technique('blockRequests',
      { urls: b.urls, except: b.except ?? [], types: b.types ?? ['script', 'xmlhttprequest'] }, b.targets));
  if (rule.blockCookies)
    out.push(technique('blockCookies', { urls: rule.blockCookies.urls }, rule.blockCookies.targets));
  if (rule.setRequestHeader) {
    const h = rule.setRequestHeader;
    out.push(technique('setRequestHeader', { urls: h.urls, name: h.name, value: h.value }, h.targets));
  }
  if (rule.removeElements)
    out.push(technique('removeElements', { at: 'idle', selectors: [rule.removeElements].flat() }, rule.removeElements.targets));
  if (rule.clearCookies)
    out.push(technique('clearCookies', { at: 'idle' }, rule.clearCookies.targets));
  for (const [slot, place] of Object.entries(CODE_SLOTS)) {
    if (!rule[slot]) continue;
    for (const [targets, v] of perTarget(rule[slot]))
      out.push(technique('code', { ...place, ...toSource(v, `${rule.id}.${slot}`) }, targets));
  }
  return { id: rule.id, name: rule.name, matches: rule.matches, techniques: out };
}

// Variant E: B grouped by target first. Top-level slots apply to every
// target; a `userscript: {...}` or `firefox: {...}` section adds slots for that
// target only. Sections add to the top level, they never replace it.
export function fromTargetSections(rule) {
  const common = fromSlots(rule);
  for (const target of TARGETS) {
    if (!rule[target]) continue;
    const section = fromSlots({ id: `${rule.id}.${target}`, ...rule[target] });
    common.techniques.push(...section.techniques.map(t => ({ ...t, targets: [target] })));
  }
  return common;
}

// Shape fingerprint used to check that all variants describe the same thing.
export function fingerprint(sites) {
  return sites
    .map(s => `${s.id}: ` + s.techniques
      .map(t => `${t.kind}${t.at ? '@' + t.at : ''}${t.world ? '/' + t.world : ''}[${t.targets.join(',')}]`)
      .sort().join(' '))
    .sort().join('\n');
}
