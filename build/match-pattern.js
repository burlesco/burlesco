// Match patterns (https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Match_patterns)
// turned into regular expressions over a full URL.

const PATTERN = /^(\*|https?|wss?|ftp|file):\/\/(\*|(?:\*\.)?[^/*:]+)?(\/.*)$/;

export function matchPatternToRegExp(pattern) {
  const m = typeof pattern === 'string' && PATTERN.exec(pattern);
  if (!m || (m[1] !== 'file' && !m[2])) {
    throw new TypeError(`"${pattern}" is not a valid match pattern`);
  }
  const [, scheme, host = '', path] = m;
  let re = '^' + (scheme === '*' ? 'https?' : scheme) + ':\\/\\/';
  if (host === '*') {
    re += '[^/]+';
  } else if (host.startsWith('*.')) {
    re += '(?:[^/]+\\.)?' + escape(host.slice(2));
  } else {
    re += escape(host);
  }
  // A host may carry a port; patterns can't name one, so allow any.
  re += '(?::\\d+)?';
  re += path.split('*').map(escape).join('.*');
  return new RegExp(re + '$');
}

const escape = s => s.replace(/[.+?^${}()|[\]\\/]/g, '\\$&');
