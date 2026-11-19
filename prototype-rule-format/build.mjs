// PROTOTYPE, throwaway. `npm run proto` builds every variant through the same
// emitters, lints sources and outputs, and prints a side-by-side summary.
import { mkdirSync, writeFileSync, rmSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ESLint } from 'eslint';
import { emitUserscript, emitFirefox, emitUbo, compatibility } from './core/emit.mjs';
import { fingerprint } from './core/ir.mjs';

const VARIANTS = ['a-strings', 'b-functions', 'c-folders', 'd-techniques', 'e-by-target'];
const LOADERS = new Set(['index.mjs', 'burlesco.js']); // plumbing, not authoring

const walk = dir => readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const write = (dir, files) => {
  mkdirSync(dir, { recursive: true });
  for (const [name, text] of Object.entries(files)) if (typeof text === 'string') writeFileSync(join(dir, name), text);
};

rmSync('dist', { recursive: true, force: true });
const eslint = new ESLint();
const results = {};

for (const v of VARIANTS) {
  const r = (results[v] = {});
  const authoring = walk(join('variants', v)).filter(p => !LOADERS.has(p.split('/').pop()));
  r.files = authoring.length;
  r.lines = authoring.reduce((n, p) => n + readFileSync(p, 'utf8').trimEnd().split('\n').length, 0);

  let sites;
  try {
    ({ sites } = await import(`./variants/${v}/index.mjs`));
  } catch (e) {
    r.error = e.message;
    continue;
  }
  const out = join('dist', v);
  write(join(out, 'userscript'), emitUserscript(sites));
  write(join(out, 'firefox'), emitFirefox(sites));
  const ubo = emitUbo(sites);
  write(join(out, 'ubo'), ubo);
  const compat = compatibility(sites);
  write(out, compat);

  r.fingerprint = fingerprint(sites);
  r.problems = compat.problems;
  r.uboLines = ubo['burlesco-ubo.txt'].trim().split('\n').length - 1;
  r.uboSkipped = ubo.skipped.length;
  r.usBytes = readFileSync(join(out, 'userscript', 'burlesco.user.js')).length;

  const lint = async glob => (await eslint.lintFiles([glob])).flatMap(f =>
    f.messages.map(m => `${relative('.', f.filePath)}:${m.line}  ${m.ruleId ?? 'parse'}  ${m.message}`));
  r.lintSource = await lint(`variants/${v}/**/*.js`);
  r.lintOutput = await lint(`dist/${v}/**/*.js`);
}

// ---------------------------------------------------------------- report
const pad = (s, n) => String(s).padEnd(n);
const cols = VARIANTS.map(v => pad(v, 14)).join('');
const row = (label, f) => console.log(pad(label, 30) + VARIANTS.map(v => pad(results[v].error ? 'ERROR' : f(results[v]), 14)).join(''));

console.log('\nPROTOTYPE: rule-file format comparison (#372)\n');
console.log(pad('', 30) + cols);
row('authoring files', r => r.files);
row('authoring lines', r => r.lines);
row('lint findings in source', r => r.lintSource.length);
row('lint findings in output', r => r.lintOutput.length);
row('same IR as b-functions', r => (r.fingerprint === results['b-functions'].fingerprint ? 'yes' : 'NO'));
row('uBO filter lines', r => r.uboLines);
row('techniques uBO cannot express', r => r.uboSkipped);
row('userscript bytes', r => r.usBytes);

for (const v of VARIANTS) {
  const r = results[v];
  if (r.error) { console.log(`\n## ${v}: failed to load\n  ${r.error}`); continue; }
  const lines = [
    ...r.lintSource.map(m => '  source  ' + m),
    ...r.lintOutput.map(m => '  output  ' + m),
    ...r.problems.map(p => '  compat  ' + p),
  ];
  if (r.fingerprint !== results['b-functions'].fingerprint) {
    const mine = r.fingerprint.split('\n'), ref = results['b-functions'].fingerprint.split('\n');
    lines.push(...mine.filter(l => !ref.includes(l)).map(l => '  IR      ' + l));
  }
  console.log(`\n## ${v}` + (lines.length ? '\n' + lines.join('\n') : '\n  (nothing to report)'));
}
console.log('\nOutputs: dist/<variant>/{userscript,firefox,ubo}/ and dist/<variant>/COMPATIBILITY.md\n');
