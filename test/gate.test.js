// Seam 2: the migration gate. Each Site has a hand-written record of what
// each Target did for it before the migration, compiled from the old
// sources. The gate checks every Rule against its record through
// techniquesFor(), so "nothing changed" doesn't rest on browser testing.
//
// Record format: test/gate/<id>.js default-exports
//   {
//     id,
//     userscript: { ...Techniques },   // omit a Target that does nothing
//     firefox:    { ...Techniques },
//   }
// with the Rule's Technique keys, where:
//   - blockRequests, blockCookies, setRequestHeader, removeElements,
//     clearCookies and connect are written as in a Rule. They are compared
//     per URL and request type, so grouping doesn't matter. The userscript
//     has no request types, so they are ignored there.
//   - page-code keys (siteStart, siteIdle, privilegedStart, privilegedIdle)
//     list one entry per piece of code, in order. An entry is a snippet, or
//     a list of snippets, that the piece's source must contain.
// Making the Targets converge later means editing a record and its Rule
// together, on purpose.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRules } from '../build/load-rules.js';
import { techniquesFor } from '../build/techniques.js';
import { TARGETS, PAGE_CODE, DEFAULT_REQUEST_TYPES } from '../build/targets.js';

const GATE_DIR = join(import.meta.dirname, 'gate');

async function loadRecords() {
  const files = (await readdir(GATE_DIR)).filter(f => f.endsWith('.js')).sort();
  return Promise.all(files.map(async f =>
    (await import(pathToFileURL(join(GATE_DIR, f)).href)).default));
}

const rules = await loadRules();
const records = await loadRecords();

const sorted = list => [...new Set(list)].sort();

// Techniques as comparable data. Page code is kept as source text.
function normalize(t, target) {
  const blocks = (t.blockRequests ?? []).flatMap(b => {
    const except = sorted(b.except ?? []).join(' ');
    const types = target === 'userscript' ? ['any'] : (b.types ?? DEFAULT_REQUEST_TYPES);
    return b.urls.flatMap(url => types.map(type => `${url} [${type}] except: ${except}`));
  });
  return {
    blockRequests: sorted(blocks),
    blockCookies: sorted([t.blockCookies ?? []].flat().flatMap(c => c.urls)),
    setRequestHeader: sorted([t.setRequestHeader ?? []].flat()
      .flatMap(h => h.urls.map(url => `${url} ${h.name}: ${h.value}`))),
    removeElements: sorted(t.removeElements ?? []),
    clearCookies: Boolean(t.clearCookies),
    connect: sorted(t.connect ?? []),
  };
}

test('every Rule has a gate record, and every record a Rule', () => {
  assert.deepEqual(sorted(records.map(r => r.id)), sorted(rules.map(r => r.id)));
});

for (const record of records) {
  const rule = rules.find(r => r.id === record.id);
  for (const target of TARGETS) {
    test(`gate: ${record.id} (${target}) does what it did before`, () => {
      assert.ok(rule, `no Rule for ${record.id}`);
      const expected = record[target] ?? {};
      const actual = techniquesFor(rule, target);
      assert.deepEqual(normalize(actual, target), normalize(expected, target));

      for (const key of Object.keys(PAGE_CODE)) {
        const pieces = actual[key].map(fn => fn.toString());
        const want = expected[key] ?? [];
        assert.equal(pieces.length, want.length, `${key}: number of pieces of code`);
        want.forEach((snippets, i) => {
          for (const s of [snippets].flat()) {
            assert.ok(pieces[i].includes(s), `${key}[${i}] should contain ${JSON.stringify(s)}`);
          }
        });
      }
    });
  }
}
