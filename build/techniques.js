// A Rule's Techniques for one Target: the top level plus that Target's
// section. Sections only add to the top level, never replace it; where both
// set the same key, the top level comes first. Every generator and the
// migration gate read Rules through this function.
import { TECHNIQUES } from './targets.js';

export function techniquesFor(rule, target) {
  const parts = [rule, rule[target] ?? {}];
  const valuesOf = key => parts.flatMap(part => (part[key] === undefined ? [] : [part[key]]));
  return Object.fromEntries(Object.entries(TECHNIQUES)
    .map(([key, technique]) => [key, technique.combine(valuesOf(key))]));
}

// Each Rule with its Techniques for one Target, as the generators read them.
export const sitesFor = (rules, target) =>
  rules.map(rule => ({ rule, techniques: techniquesFor(rule, target) }));

export const isEmpty = value =>
  Array.isArray(value) ? value.length === 0 : !value;

// True when a Rule gives this Target anything at all to do.
export const hasTechniques = (rule, target) =>
  Object.values(techniquesFor(rule, target)).some(value => !isEmpty(value));
