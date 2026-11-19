// The userscript generator: one self-contained burlesco.user.js for
// Tampermonkey.
import { sitesFor, hasTechniques } from './techniques.js';
import { indent } from './page-code.js';
import { statementsAt, guarded } from './page-placement.js';
import * as runtime from './runtime.js';

const LATEST =
  'https://github.com/burlesco/burlesco/releases/latest/download/burlesco.user.js';

const NOTE = '// Atenção:      Caso algum site não funcione logo após a instalação, ' +
  'limpe o cache do navegador.';

// A Site is in the userscript when it has Techniques there, or a userscript
// section, even an empty one: that Site only gets its @match.
const inUserscript = rule =>
  rule.userscript !== undefined || hasTechniques(rule, 'userscript');

export function userscript(rules, { version }) {
  const sites = sitesFor(rules.filter(inUserscript), 'userscript');
  const blocks = sites.map(siteBlock).filter(Boolean);
  const helpers = Object.values(runtime).map(fn => fn.toString());
  return [header(sites, version), ...blocks, ...helpers].join('\n\n') + '\n';
}

// One Site's page code, behind its host check. Start code runs as soon as
// the script does, which is before the Site's own scripts (@run-at
// document-start); idle code waits for the page.
function siteBlock({ rule, techniques: t }) {
  const body = statementsAt(t, 'start');
  const idle = statementsAt(t, 'idle');
  if (idle.length) body.push(`onIdle(() => {\n${indent(idle.join('\n'), 2)}\n});`);
  return body.length ? guarded(rule, body) : null;
}

function header(sites, version) {
  const unique = list => [...new Set(list)];
  const matches = unique(sites.flatMap(s => s.rule.matches));
  const connect = unique(sites.flatMap(s => s.techniques.connect));
  const grants = ['GM_webRequest', ...usedGrants(sites)];

  const fields = [
    ['name', 'Burlesco'],
    ['namespace', 'https://burles.co/'],
    ['version', version],
    ['description', 'Leia notícias sem ser assinante, burle o paywall'],
    ['author', 'rodorgas & AugustoResende'],
    ['supportURL', 'https://burles.co'],
    ['updateURL', LATEST],
    ['downloadURL', LATEST],
    ['icon', 'https://raw.githubusercontent.com/burlesco/site/master/logo_semfundo.png'],
    ...grants.map(g => ['grant', g]),
    ...connect.map(host => ['connect', host]),
    ...matches.map(m => ['match', m]),
    // Tampermonkey 5.2+ on Chrome (MV3) ignores this; Firefox still honours it.
    ['webRequest', JSON.stringify(webRequest(sites))],
    ['run-at', 'document-start'],
    ['noframes', ''],
  ];
  const lines = fields.map(([k, v]) => `// @${k.padEnd(12)} ${v}`.trimEnd());
  // Today's header carries this note, not a tag, right after @icon.
  lines.splice(fields.findIndex(([k]) => k === 'icon') + 1, 0, NOTE);
  return ['// ==UserScript==', ...lines, '// ==/UserScript=='].join('\n');
}

// Tampermonkey selectors have no request types: a block covers every type.
// A block several Sites share (a vendor's script) is listed once.
function webRequest(sites) {
  const items = sites.flatMap(s => s.techniques.blockRequests).flatMap(b =>
    b.urls.map(url => ({
      selector: b.except.length
        ? { include: url, exclude: b.except.length === 1 ? b.except[0] : b.except }
        : url,
      action: 'cancel',
    })));
  const seen = new Set();
  return items.filter(item => {
    const key = JSON.stringify(item);
    return !seen.has(key) && seen.add(key);
  });
}

// The GM_ APIs that privileged code calls, so each one is granted.
function usedGrants(sites) {
  const names = sites.flatMap(s =>
    [...s.techniques.privilegedStart, ...s.techniques.privilegedIdle]
      .flatMap(fn => fn.toString().match(/\bGM_\w+/g) ?? []));
  return [...new Set(names)].filter(n => n !== 'GM_webRequest').sort();
}
