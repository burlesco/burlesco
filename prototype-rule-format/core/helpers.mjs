// PROTOTYPE, throwaway. Runtime helpers inlined into every emitted script.
// Dogfooding the function format: these are real functions, emitted via
// toString(), so they get lint and highlighting here.

export function injectFn(fn) {
  const script = document.createElement('script');
  script.textContent = '(' + fn + ')();';
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

export function injectPageCode(code) {
  const script = document.createElement('script');
  script.textContent = code;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

export function onIdle(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}

export function eraseAllCookies() {
  const host = location.hostname;
  const domains = [host, host.replace(/^www\./, ''), host.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2')];
  for (const pair of document.cookie.split(/;\s*/)) {
    const name = pair.split('=')[0];
    for (const d of domains)
      document.cookie = `${name}=; domain=${d}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
}

export function matchPatternToRegExp(pattern) {
  const m = /^(\*|https?):\/\/(\*|(?:\*\.)?[^/*]+)(\/.*)$/.exec(pattern);
  if (!m) throw new TypeError(`"${pattern}" is not a valid match pattern`);
  let [, scheme, host, path] = m;
  let re = '^' + (scheme === '*' ? 'https?' : scheme) + '://';
  if (host === '*') re += '[^/]+';
  else {
    if (host.startsWith('*.')) { re += '(?:[^/]+\\.)?'; host = host.slice(2); }
    re += host.replace(/\./g, '\\.');
  }
  re += path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(re + '$');
}
