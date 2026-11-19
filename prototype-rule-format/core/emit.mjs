// PROTOTYPE, throwaway. One emitter per target, plus the compatibility table
// and a uBlock Origin filter list (a third target nobody asked for yet, to
// see which formats make it cheap).
import { pageSide, network, helperSource, hostTest, indent, NETWORK } from './codegen.mjs';
import { matchPatternToRegExp } from './helpers.mjs';
import { TARGETS } from './ir.mjs';

// ---------------------------------------------------------------- userscript
export function emitUserscript(sites) {
  const matches = [...new Set(sites.flatMap(s => s.matches))];
  const rules = network(sites, 'userscript', 'blockRequests').flatMap(r => r.urls.map(u => ({
    selector: r.except.length ? { include: u, exclude: r.except } : u,
    action: 'cancel',
  })));
  const header = [
    '// ==UserScript==',
    '// @name         Burlesco (PROTOTYPE build)',
    '// @version      0.0.0-prototype',
    '// @grant        GM_xmlhttpRequest',
    ...matches.map(m => `// @match        ${m}`),
    `// @webRequest   ${JSON.stringify(rules)}`,
    '// @run-at       document-start',
    '// @noframes',
    '// ==/UserScript==',
  ].join('\n');

  const blocks = pageSide(sites, 'userscript').map(({ site, start, idle }) => {
    const body = [...start];
    if (idle.length) body.push(`onIdle(() => {\n${indent(idle.join('\n'), 2)}\n});`);
    return `// ${site.name}\nif (${hostTest(site)}) {\n${indent(body.join('\n'), 2)}\n}`;
  });

  const helpers = helperSource(['injectFn', 'injectPageCode', 'onIdle', 'eraseAllCookies']);
  return { 'burlesco.user.js': `${header}\n\n${blocks.join('\n\n')}\n\n${helpers}\n` };
}

// ---------------------------------------------------------------- firefox
const BACKGROUND_ENGINE = `
for (const r of RULES.blockRequests) {
  const except = r.except.map(matchPatternToRegExp);
  browser.webRequest.onBeforeRequest.addListener(
    d => ({ cancel: !except.some(re => re.test(d.url)) }),
    { urls: r.urls, types: r.types }, ['blocking']);
}
for (const r of RULES.blockCookies) {
  browser.webRequest.onBeforeSendHeaders.addListener(
    d => ({ requestHeaders: d.requestHeaders.filter(h => h.name.toLowerCase() !== 'cookie') }),
    { urls: r.urls }, ['blocking', 'requestHeaders']);
  browser.webRequest.onHeadersReceived.addListener(
    d => ({ responseHeaders: d.responseHeaders.filter(h => h.name.toLowerCase() !== 'set-cookie') }),
    { urls: r.urls }, ['blocking', 'responseHeaders']);
}
for (const r of RULES.setRequestHeader) {
  browser.webRequest.onBeforeSendHeaders.addListener(d => {
    const rest = d.requestHeaders.filter(h => h.name.toLowerCase() !== r.name.toLowerCase());
    return { requestHeaders: [...rest, { name: r.name, value: r.value }] };
  }, { urls: r.urls, types: ['main_frame', 'xmlhttprequest'] }, ['blocking', 'requestHeaders']);
}
`;

export function emitFirefox(sites) {
  const strip = ({ kind, targets, ...rest }) => rest; // eslint-disable-line no-unused-vars
  const RULES = Object.fromEntries(NETWORK.map(k => [k, network(sites, 'firefox', k).map(strip)]));
  const background = `const RULES = ${JSON.stringify(RULES, null, 2)};\n${BACKGROUND_ENGINE}\n${helperSource(['matchPatternToRegExp'])}\n`;

  const pieces = pageSide(sites, 'firefox');
  const content = (which, helpers) => {
    const blocks = pieces.filter(p => p[which].length)
      .map(({ site, ...p }) => `// ${site.name}\nif (${hostTest(site)}) {\n${indent(p[which].join('\n'), 2)}\n}`);
    return `${blocks.join('\n\n')}\n\n${helperSource(helpers)}\n`;
  };
  const matchesFor = which => [...new Set(pieces.filter(p => p[which].length).flatMap(p => p.site.matches))];
  const hostPerms = [...new Set(NETWORK.flatMap(k => RULES[k].flatMap(r => r.urls)))];

  const manifest = {
    manifest_version: 2,
    name: 'burlesco (PROTOTYPE build)',
    version: '0.0.0',
    background: { scripts: ['background.js'] },
    content_scripts: [
      { js: ['content-start.js'], run_at: 'document_start', matches: matchesFor('start') },
      { js: ['content-idle.js'], run_at: 'document_idle', matches: matchesFor('idle') },
    ],
    permissions: ['webRequest', 'webRequestBlocking', ...hostPerms],
    browser_specific_settings: { gecko: { id: 'burlesco@burles.co' } },
  };
  return {
    'manifest.json': JSON.stringify(manifest, null, 2) + '\n',
    'background.js': background,
    'content-start.js': content('start', ['injectFn', 'injectPageCode']),
    'content-idle.js': content('idle', ['injectFn', 'injectPageCode', 'eraseAllCookies']),
  };
}

// ---------------------------------------------------------------- uBlock Origin
// Only declarative techniques translate; arbitrary code never will.
export function emitUbo(sites) {
  const lines = ['! Burlesco (PROTOTYPE build). Only declarative techniques are representable.'];
  const net = p => {
    const m = /^[^:]+:\/\/(?:\*\.)?([^/]+)(\/.*)$/.exec(p);
    return '||' + m[1] + (m[2] === '/*' ? '^' : m[2]);
  };
  const typeMap = { script: 'script', xmlhttprequest: 'xhr' };
  const skipped = [];
  for (const s of sites) {
    for (const t of s.techniques) {
      if (t.kind === 'blockRequests') {
        const opts = '$' + t.types.map(x => typeMap[x]).join(',');
        lines.push(...t.urls.map(u => net(u) + opts), ...t.except.map(u => '@@' + net(u) + opts));
      } else if (t.kind === 'removeElements') {
        const hosts = s.matches.map(m => /:\/\/(?:\*\.)?([^/]+)/.exec(m)[1]).join(',');
        lines.push(`${hosts}##${t.selectors.join(', ')}`);
      } else skipped.push(`${s.id}:${t.kind}`);
    }
  }
  return { 'burlesco-ubo.txt': lines.join('\n') + '\n', skipped };
}

// ---------------------------------------------------------------- compatibility
const SUPPORT = {
  userscript: new Set(['blockRequests', 'code', 'removeElements', 'clearCookies']),
  firefox: new Set(['blockRequests', 'blockCookies', 'setRequestHeader', 'code', 'removeElements', 'clearCookies']),
};
const CAVEAT = { userscript: { blockRequests: 'ignored by Tampermonkey 5.2+ on Chrome (MV3)' } };

export function compatibility(sites) {
  const rows = ['| Site | ' + TARGETS.join(' | ') + ' |', '|---|' + TARGETS.map(() => '---').join('|') + '|'];
  const problems = [];
  for (const s of sites) {
    const cells = TARGETS.map(target => {
      const mine = s.techniques.filter(t => t.targets.includes(target));
      for (const t of mine) {
        if (!SUPPORT[target].has(t.kind)) problems.push(`${s.id}: ${t.kind} targeted at ${target}, which can't do it`);
        if (t.kind === 'code' && t.world === 'isolated' && /GM_/.test(t.source) && target !== 'userscript')
          problems.push(`${s.id}: isolated code uses GM_* but targets ${target}`);
      }
      if (!mine.length) return '—';
      return [...new Set(mine.map(t => t.kind + (CAVEAT[target]?.[t.kind] ? '⚠' : '')))].join(', ');
    });
    rows.push(`| ${s.name} | ${cells.join(' | ')} |`);
  }
  rows.push('', '⚠ request blocking is ' + CAVEAT.userscript.blockRequests + '.');
  return { 'COMPATIBILITY.md': rows.join('\n') + '\n', problems };
}

export { matchPatternToRegExp };
