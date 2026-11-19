// PROTOTYPE, throwaway. Turns page-side techniques into JS statements.
import * as H from './helpers.mjs';

export const PAGE_SIDE = ['code', 'removeElements', 'clearCookies'];
export const NETWORK = ['blockRequests', 'blockCookies', 'setRequestHeader'];

function minIndent(lines) {
  const ind = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
  return ind.length ? Math.min(...ind) : 0;
}

// fn.toString() keeps the source file's indentation on every line but the first.
function dedentFunction(src) {
  const [first, ...rest] = src.split('\n');
  const n = minIndent(rest);
  return [first, ...rest.map(l => l.slice(n))].join('\n');
}

function dedentString(src) {
  const lines = src.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const n = minIndent(lines);
  return lines.map(l => l.slice(n)).join('\n');
}

export const indent = (s, n) => s.split('\n').map(l => (l ? ' '.repeat(n) + l : l)).join('\n');

export function statement(t) {
  if (t.kind === 'clearCookies') return 'eraseAllCookies();';
  if (t.kind === 'removeElements')
    return `document.querySelectorAll(${JSON.stringify(t.selectors.join(', '))}).forEach(e => e.remove());`;
  const isFn = t.sourceKind === 'function';
  const src = isFn ? dedentFunction(t.source) : dedentString(t.source);
  if (t.world === 'page')
    return isFn ? `injectFn(${src});` : `injectPageCode(${JSON.stringify(src)});`;
  return isFn ? `(${src})();` : `{\n${indent(src, 2)}\n}`;
}

export function helperSource(names) {
  return names.map(n => H[n].toString()).join('\n\n');
}

export function hostTest(site) {
  const res = site.matches.map(m => H.matchPatternToRegExp(m).toString());
  return `[${res.join(', ')}].some(re => re.test(location.href))`;
}

// Page-side pieces of each site for one target, split by run time.
export function pageSide(sites, target) {
  return sites.map(site => {
    const mine = site.techniques.filter(t => PAGE_SIDE.includes(t.kind) && t.targets.includes(target));
    return {
      site,
      start: mine.filter(t => t.at === 'start').map(statement),
      idle: mine.filter(t => t.at === 'idle').map(statement),
    };
  }).filter(p => p.start.length || p.idle.length);
}

export const network = (sites, target, kind) =>
  sites.flatMap(s => s.techniques
    .filter(t => t.kind === kind && t.targets.includes(target))
    .map(t => ({ site: s.id, ...t })));
