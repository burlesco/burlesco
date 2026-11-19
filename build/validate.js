// Rule validation. Runs before anything is generated, and reports every
// problem in every Rule at once.
import { TARGETS, TECHNIQUES, TECHNIQUE_KEYS, SUPPORTS } from './targets.js';
import { techniquesFor, isEmpty } from './techniques.js';
import { checkPatterns, isPlainObject } from './rule-checks.js';

const RULE_KEYS = new Set(['id', 'name', 'matches', ...TECHNIQUE_KEYS, ...TARGETS]);

export class RuleError extends Error {
  constructor(problems) {
    super(`Invalid Rules:\n${problems.map(p => `  - ${p}`).join('\n')}`);
    this.name = 'RuleError';
    this.problems = problems;
  }
}

export function validate(rules) {
  const problems = [];
  const seen = new Set();
  rules.forEach((rule, i) => {
    const label = typeof rule?.id === 'string' ? rule.id : `Rule #${i + 1}`;
    const report = msg => problems.push(`${label}: ${msg}`);
    if (!isPlainObject(rule)) return report('a Rule must be an object');
    if (seen.has(rule.id)) report('another Rule has the same id');
    seen.add(rule.id);
    const before = problems.length;
    checkRule(rule, report);
    // Only combine sections once their shape is known to be sound.
    if (problems.length === before) checkTargets(rule, report);
  });
  if (problems.length) throw new RuleError(problems);
}

function checkRule(rule, report) {
  if (typeof rule.id !== 'string' || !/^[a-z0-9]+$/.test(rule.id)) {
    report('"id" must be a string of lowercase letters and digits');
  }
  if (typeof rule.name !== 'string' || !rule.name.trim()) {
    report('"name" must be a non-empty string');
  }
  if (!Array.isArray(rule.matches) || !rule.matches.length) {
    report('"matches" must be a non-empty list of match patterns');
  } else {
    checkPatterns(rule.matches, 'matches', report);
  }

  for (const [key, value] of Object.entries(rule)) {
    if (RULE_KEYS.has(key)) continue;
    // A plain object where a Technique would be is almost always a section.
    if (isPlainObject(value)) {
      report(`unknown Target section "${key}" (Targets are ${TARGETS.join(', ')})`);
    } else {
      report(`unknown key "${key}"`);
    }
  }
  checkTechniques(rule, '', report);

  for (const target of TARGETS) {
    const section = rule[target];
    if (section === undefined) continue;
    if (!isPlainObject(section)) {
      report(`"${target}" must be an object of Techniques`);
      continue;
    }
    for (const key of Object.keys(section)) {
      if (!TECHNIQUE_KEYS.includes(key)) report(`unknown key "${target}.${key}"`);
    }
    checkTechniques(section, `${target}.`, report);
  }
}

// Each Technique set here, checked the way its descriptor says.
function checkTechniques(where, prefix, report) {
  for (const [key, technique] of Object.entries(TECHNIQUES)) {
    if (where[key] !== undefined) technique.check(where[key], `${prefix}${key}`, report);
  }
}

// Techniques that are well formed but that a Target can't carry out.
function checkTargets(rule, report) {
  for (const target of TARGETS) {
    const techniques = techniquesFor(rule, target);
    for (const [key, value] of Object.entries(techniques)) {
      if (!isEmpty(value) && !SUPPORTS[target].has(key)) {
        const able = TARGETS.filter(other => SUPPORTS[other].has(key));
        const where = able.length === 1
          ? `the ${able[0]} section` : 'a section for a Target that can';
        report(`the ${target} can't run "${key}"; move it to ${where}`);
      }
    }
  }
}
