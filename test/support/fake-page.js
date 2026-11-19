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
// stored: what browser.storage.local holds. Content scripts read it before
// running, so each moment settles before the next one starts.
export function runContentScripts(files, href, stored = {}) {
  const manifest = JSON.parse(files['dist/firefox/manifest.json']);
  const scripts = runAt => (manifest.content_scripts ?? [])
    .filter(cs => cs.run_at === runAt)
    .filter(cs => cs.matches.some(m => matchPatternToRegExp(m).test(href)))
    .flatMap(cs => cs.js.map(js => files[`dist/firefox/${js}`]));
  const browser = {
    storage: {
      local: {
        get: async key => (key in stored ? { [key]: structuredClone(stored[key]) } : {}),
      },
    },
  };
  return runPage(href, { browser }, async run => {
    scripts('document_start').forEach(run);
    await tick();
    return async () => {
      scripts('document_idle').forEach(run);
      await tick();
    };
  });
}

const tick = () => new Promise(resolve => setImmediate(resolve));

// load(run) runs the start scripts and returns what to run once the page
// has loaded. Either may be async; then so is runPage.
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

  const result = { log, removed, cookieWrites };
  const finish = atIdle => {
    phase = 'idle';
    document.readyState = 'interactive';
    for (const fn of listeners) fn();
    const after = atIdle();
    return after instanceof Promise ? after.then(() => result) : result;
  };
  const atIdle = load(script => vm.runInContext(script, privileged));
  return atIdle instanceof Promise ? atIdle.then(finish) : finish(atIdle);
}
