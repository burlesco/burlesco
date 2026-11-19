// Page code is written as functions in the Rules and serialized with
// toString(), so it stays real, readable JavaScript in the output.

export function serializeFunction(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('page code must be a function');
  }
  const src = fn.toString();
  if (/^class\b/.test(src) || /\{\s*\[native code\]\s*\}$/.test(src)) {
    throw new TypeError('page code must be an arrow function or a function expression');
  }
  try {
    // Parses without running: the source must stand alone as an expression.
    new Function(`return (${src});`);
  } catch {
    throw new TypeError(
      "method shorthand (`siteIdle() { ... }`) can't be serialized; " +
      'write `siteIdle: () => { ... }` instead');
  }
  return dedent(src);
}

// toString() keeps the Rule file's indentation on every line but the first.
function dedent(src) {
  const [first, ...rest] = src.split('\n');
  const widths = rest.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
  const n = widths.length ? Math.min(...widths) : 0;
  return [first, ...rest.map(l => l.slice(n))].join('\n');
}

export const indent = (text, n) =>
  text.split('\n').map(l => (l ? ' '.repeat(n) + l : l)).join('\n');
