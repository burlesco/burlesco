// How a Rule must write each Technique. Each check takes the value, where it
// sits (for messages, e.g. "firefox.blockRequests") and report(message).
// targets.js hands them to the Technique they belong to.
import { REQUEST_TYPES } from './request-types.js';
import { matchPatternToRegExp } from './match-pattern.js';
import { serializeFunction } from './page-code.js';
import * as runtime from './runtime.js';

export function blockRequests(value, here, report) {
  if (!Array.isArray(value)) {
    report(`"${here}" must be a list of { urls, except, types }`);
    return;
  }
  value.forEach((block, i) => {
    const at = `${here}[${i}]`;
    if (!checkShape(block, ['urls', 'except', 'types'], at, report)) return;
    checkPatternList(block.urls, `${at}.urls`, report, true);
    if (block.except !== undefined) {
      checkPatternList(block.except, `${at}.except`, report, false);
    }
    if (block.types === undefined) return;
    if (!Array.isArray(block.types) || !block.types.length) {
      report(`"${at}.types" must be a non-empty list`);
      return;
    }
    for (const type of block.types) {
      if (!REQUEST_TYPES.has(type)) report(`"${at}.types" has unknown request type "${type}"`);
    }
  });
}

export function blockCookies(value, here, report) {
  if (checkShape(value, ['urls'], here, report)) {
    checkPatternList(value.urls, `${here}.urls`, report, true);
  }
}

export function setRequestHeader(value, here, report) {
  [value].flat().forEach((header, i) => {
    const at = here + (Array.isArray(value) ? `[${i}]` : '');
    if (!checkShape(header, ['urls', 'name', 'value'], at, report)) return;
    checkPatternList(header.urls, `${at}.urls`, report, true);
    if (typeof header.name !== 'string' || !header.name) report(`"${at}.name" must be a header name`);
    if (typeof header.value !== 'string') report(`"${at}.value" must be a string`);
  });
}

export function removeElements(value, here, report) {
  if (!isStringList(value)) report(`"${here}" must be a non-empty list of CSS selectors`);
}

export function clearCookies(value, here, report) {
  if (value !== true) report(`"${here}" must be true`);
}

export function connect(value, here, report) {
  if (!isStringList(value)) report(`"${here}" must be a non-empty list of hosts`);
}

// The helpers the generated scripts carry. They live in the privileged
// environment, so code injected into the page can't call them.
const HELPERS = Object.keys(runtime);
const helperCalls = src => HELPERS.filter(name =>
  new RegExp(`(?<![\\w$.])${name}(?![\\w$])`).test(src));

// Page code for one environment ('site' or 'privileged'). `privileged` names
// the key the code should move to if it needs the privileged helpers.
export const pageCode = (environment, privileged) => (value, here, report) => {
  let src;
  try {
    src = serializeFunction(value);
  } catch (err) {
    report(`"${here}": ${err.message}`);
    return;
  }
  if (environment !== 'site') return;
  for (const name of helperCalls(src)) {
    report(`"${here}" uses ${name}, a helper only privileged code can see; ` +
      `move the code to ${privileged}`);
  }
};

export function checkShape(value, keys, here, report) {
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

export function checkPatterns(list, here, report) {
  for (const pattern of list) {
    try {
      matchPatternToRegExp(pattern);
    } catch {
      report(`"${here}" has an invalid match pattern ${JSON.stringify(pattern)}`);
    }
  }
}

export const isPlainObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isStringList = value =>
  Array.isArray(value) && value.length > 0 && value.every(s => typeof s === 'string' && s);
