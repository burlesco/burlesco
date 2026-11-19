// What a Site runs on its pages at each moment, as statements, and the host
// check that gates it. Shared by every generator, so the Targets place page
// code the same way. The statements call the helpers in runtime.js.
import { PAGE_CODE } from './targets.js';
import { serializeFunction, indent } from './page-code.js';
import { matchPatternToRegExp } from './match-pattern.js';

const RUN = {
  site: fn => `runInSite(${serializeFunction(fn)});`,
  privileged: fn => `(${serializeFunction(fn)})();`,
};

// techniques: the Site's Techniques for one Target; moment: 'start' or 'idle'.
export function statementsAt(techniques, moment) {
  const statements = Object.entries(PAGE_CODE)
    .filter(([, place]) => place.moment === moment)
    .flatMap(([key, place]) => techniques[key].map(RUN[place.environment]));
  if (moment === 'idle') {
    if (techniques.removeElements.length) {
      statements.push(`removeElements(${JSON.stringify(techniques.removeElements.join(', '))});`);
    }
    if (techniques.clearCookies) statements.push('eraseAllCookies();');
  }
  return statements;
}

// One Site's statements behind a host check generated from its matches.
export function guarded(rule, statements) {
  const res = rule.matches.map(m => matchPatternToRegExp(m).toString());
  const check = `[${res.join(', ')}].some(re => re.test(location.href))`;
  return `// ${rule.name}\nif (${check}) {\n${indent(statements.join('\n'), 2)}\n}`;
}
