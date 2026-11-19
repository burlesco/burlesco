// Runs a generated userscript against a fake page, so tests observe what it
// does rather than how its text is laid out.
//
// The Site environment and the privileged environment are separate vm
// contexts that share one document, as in a browser. Only the Site's
// context has `siteMarker`, so page code can tell where it runs. Code
// injected through a <script> element runs in the Site's context.
import vm from 'node:vm';

export function runUserscript(script, href) {
  const listeners = [];
  const removed = [];
  const cookieWrites = [];
  const log = [];
  let phase = 'start';

  const inject = el => {
    if (el.tagName === 'SCRIPT') vm.runInContext(el.textContent, site);
    return el;
  };
  const document = {
    readyState: 'loading',
    addEventListener: (type, fn) => {
      if (type === 'DOMContentLoaded') listeners.push(fn);
    },
    createElement: tag => ({
      tagName: tag.toUpperCase(),
      textContent: '',
      remove() {},
      parentNode: { removeChild() {} },
    }),
    head: { appendChild: inject },
    documentElement: { appendChild: inject },
    querySelectorAll: selector => [{ remove: () => removed.push(selector) }],
    get cookie() { return 'a=1; b=2'; },
    set cookie(value) { cookieWrites.push(value); },
    // Page code reports what ran by writing here.
    burlesco: entry => log.push(`${entry} @${phase}`),
  };
  const url = new URL(href);
  const location = {
    href, hostname: url.hostname, host: url.host, pathname: url.pathname,
  };

  const site = vm.createContext({ document, location, siteMarker: true });
  site.window = site;
  const privileged = vm.createContext({ document, location, GM_xmlhttpRequest() {} });
  privileged.window = privileged;

  vm.runInContext(script, privileged);
  phase = 'idle';
  document.readyState = 'interactive';
  for (const fn of listeners) fn();

  return { log, removed, cookieWrites };
}
