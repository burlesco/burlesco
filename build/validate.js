// Rule validation. Runs before anything is generated, and reports every
// problem in every Rule at once.
import {
  TARGETS, TECHNIQUES, PAGE_CODE, SUPPORTS, REQUEST_TYPES,
} from './targets.js';
import { techniquesFor, isEmpty } from './techniques.js';
import { matchPatternToRegExp } from './match-pattern.js';
import { serializeFunction } from './page-code.js';
import * as runtime from './runtime.js';

// The helpers the generated scripts carry. They live in the privileged
// environment, so code injected into the page can't call them.
const HELPERS = Object.keys(runtime);
const helperCalls = src => HELPERS.filter(name =>
  new RegExp(`(?<![\\w$.])${name}(?![\\w$])`).test(src));

const RULE_KEYS = new Set(['id', 'name', 'matches', ...TECHNIQUES, ...TARGETS]);

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
      if (!TECHNIQUES.includes(key)) report(`unknown key "${target}.${key}"`);
    }
    checkTechniques(section, `${target}.`, report);
  }
}

function checkTechniques(where, prefix, report) {
  const at = key => `"${prefix}${key}"`;
  const v = where;

  if (v.blockRequests !== undefined) {
    if (!Array.isArray(v.blockRequests)) {
      report(`${at('blockRequests')} must be a list of { urls, except, types }`);
    } else {
      v.blockRequests.forEach((block, i) => {
        const here = `${prefix}blockRequests[${i}]`;
        if (!checkShape(block, ['urls', 'except', 'types'], here, report)) return;
        checkPatternList(block.urls, `${here}.urls`, report, true);
        if (block.except !== undefined) {
          checkPatternList(block.except, `${here}.except`, report, false);
        }
        if (block.types !== undefined) {
          if (!Array.isArray(block.types) || !block.types.length) {
            report(`"${here}.types" must be a non-empty list`);
          } else {
            for (const t of block.types) {
              if (!REQUEST_TYPES.has(t)) {
                report(`"${here}.types" has unknown request type "${t}"`);
              }
            }
          }
        }
      });
    }
  }

  if (v.blockCookies !== undefined) {
    if (checkShape(v.blockCookies, ['urls'], `${prefix}blockCookies`, report)) {
      checkPatternList(v.blockCookies.urls, `${prefix}blockCookies.urls`, report, true);
    }
  }

  if (v.setRequestHeader !== undefined) {
    const list = [v.setRequestHeader].flat();
    list.forEach((h, i) => {
      const here = `${prefix}setRequestHeader` + (Array.isArray(v.setRequestHeader) ? `[${i}]` : '');
      if (!checkShape(h, ['urls', 'name', 'value'], here, report)) return;
      checkPatternList(h.urls, `${here}.urls`, report, true);
      if (typeof h.name !== 'string' || !h.name) report(`"${here}.name" must be a header name`);
      if (typeof h.value !== 'string') report(`"${here}.value" must be a string`);
    });
  }

  if (v.removeElements !== undefined && !isStringList(v.removeElements)) {
    report(`${at('removeElements')} must be a non-empty list of CSS selectors`);
  }

  if (v.clearCookies !== undefined && v.clearCookies !== true) {
    report(`${at('clearCookies')} must be true`);
  }

  if (v.connect !== undefined && !isStringList(v.connect)) {
    report(`${at('connect')} must be a non-empty list of hosts`);
  }

  for (const key of Object.keys(PAGE_CODE)) {
    if (v[key] === undefined) continue;
    let src;
    try {
      src = serializeFunction(v[key]);
    } catch (err) {
      report(`${at(key)}: ${err.message}`);
      continue;
    }
    if (PAGE_CODE[key].environment !== 'site') continue;
    for (const name of helperCalls(src)) {
      report(`${at(key)} uses ${name}, a helper only privileged code can see; ` +
        `move the code to ${key.replace('site', 'privileged')}`);
    }
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

function checkShape(value, keys, here, report) {
  if (!isPlainObject(value)) {
    report(`"${here}" must be an object with ${keys.join(', ')}`);
    return false;
  }
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) report(`unknown key "${here}.${key}"`);
  }
  return true;
}

function checkPatternList(list, here, report, required) {
  if (!Array.isArray(list) || (required && !list.length)) {
    report(`"${here}" must be a${required ? ' non-empty' : ''} list of match patterns`);
    return;
  }
  checkPatterns(list, here, report);
}

function checkPatterns(list, here, report) {
  for (const pattern of list) {
    try {
      matchPatternToRegExp(pattern);
    } catch {
      report(`"${here}" has an invalid match pattern ${JSON.stringify(pattern)}`);
    }
  }
}

const isPlainObject = v =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const isStringList = v =>
  Array.isArray(v) && v.length > 0 && v.every(s => typeof s === 'string' && s);
