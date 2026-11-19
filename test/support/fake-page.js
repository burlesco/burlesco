// Runs a generated userscript, or the Firefox extension's content scripts,
// against a fake page, so tests observe what they do rather than how their
// text is laid out.
//
// The Site environment and the privileged environment are separate vm
// contexts that share one document, as in a browser. Only the Site's
// context has `siteMarker`, so page code can tell where it runs. Code
// injected through a <script> element runs in the Site's context.
import vm from 'node:vm';
import { matchPatternToRegExp } from '../../build/match-pattern.js';

export function runUserscript(script, href) {
  return runPage(href, { GM_xmlhttpRequest() {} }, run => {
    run(script);
    return () => {};
  });
}

// Loads the content scripts the manifest registers for this URL, each at its
// run_at moment, as Firefox does.
export function runContentScripts(files, href) {
  const manifest = JSON.parse(files['dist/firefox/manifest.json']);
  const scripts = runAt => (manifest.content_scripts ?? [])
    .filter(cs => cs.run_at === runAt)
    .filter(cs => cs.matches.some(m => matchPatternToRegExp(m).test(href)))
    .flatMap(cs => cs.js.map(js => files[`dist/firefox/${js}`]));
  return runPage(href, { browser: {} }, run => {
    scripts('document_start').forEach(run);
    return () => scripts('document_idle').forEach(run);
  });
}

// load(run) runs the start scripts and returns what to run once the page
// has loaded.
function runPage(href, privilegedGlobals, load) {
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
  const privileged = vm.createContext({ document, location, ...privilegedGlobals });
  privileged.window = privileged;

  const atIdle = load(script => vm.runInContext(script, privileged));
  phase = 'idle';
  document.readyState = 'interactive';
  for (const fn of listeners) fn();
  atIdle();

  return { log, removed, cookieWrites };
}
