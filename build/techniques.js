// A Rule's Techniques for one Target: the top level plus that Target's
// section. Sections only add to the top level, never replace it; where both
// set the same key, the top level comes first. Every generator and the
// migration gate read Rules through this function.
import { PAGE_CODE, DEFAULT_REQUEST_TYPES } from './targets.js';

export function techniquesFor(rule, target) {
  const parts = [rule, rule[target] ?? {}];
  const all = key => parts.flatMap(p => (p[key] === undefined ? [] : [p[key]]));

  const techniques = {
    blockRequests: all('blockRequests').flat().map(b => ({
      urls: [...b.urls],
      except: [...(b.except ?? [])],
      types: [...(b.types ?? DEFAULT_REQUEST_TYPES)],
    })),
    blockCookies: all('blockCookies').map(c => ({ urls: [...c.urls] })),
    setRequestHeader: all('setRequestHeader').flat()
      .map(({ urls, name, value }) => ({ urls: [...urls], name, value })),
    removeElements: all('removeElements').flat(),
    clearCookies: all('clearCookies').some(Boolean),
    connect: all('connect').flat(),
  };
  for (const key of Object.keys(PAGE_CODE)) techniques[key] = all(key);
  return techniques;
}

export const isEmpty = value =>
  Array.isArray(value) ? value.length === 0 : !value;

// True when a Rule gives this Target anything at all to do.
export const hasTechniques = (rule, target) =>
  Object.values(techniquesFor(rule, target)).some(v => !isEmpty(v));
