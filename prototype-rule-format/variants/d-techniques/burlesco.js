// Variant D authoring API: each helper returns one technique (IR) directly.
import { technique, toSource, TARGETS } from '../../core/ir.mjs';

export const site = ({ id, name, matches }, ...techniques) =>
  ({ id, name, matches, techniques: techniques.flat() });

export const blockRequests = (urls, { except = [], types = ['script', 'xmlhttprequest'] } = {}) =>
  technique('blockRequests', { urls, except, types });
export const blockCookies = urls => technique('blockCookies', { urls });
export const setRequestHeader = (urls, name, value) => technique('setRequestHeader', { urls, name, value });

export const inPage = (at, fn) => technique('code', { at, world: 'page', ...toSource(fn, 'inPage') });
export const inSandbox = (at, fn) => technique('code', { at, world: 'isolated', ...toSource(fn, 'inSandbox') });

export const removeElements = (...selectors) => technique('removeElements', { at: 'idle', selectors });
export const clearCookies = () => technique('clearCookies', { at: 'idle' });

// only('firefox', a, b) / only(['firefox'], a, b)
export const only = (targets, ...ts) => {
  const list = [targets].flat();
  for (const t of list) if (!TARGETS.includes(t)) throw new Error(`unknown target "${t}"`);
  return ts.flat().map(t => ({ ...t, targets: list }));
};
