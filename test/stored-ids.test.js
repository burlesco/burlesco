// Every Site id the current options page stores must have a Rule, so that
// people's saved on/off choices still apply after the migration (#415).
// The ids are copied from SITES in the pre-migration src/options.js (v14.0).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadRules } from '../build/load-rules.js';

const STORED_IDS = [
  'brpolitico', 'correio24horas', 'correiopopular', 'crusoe',
  'diarioabcpaulista', 'diarinho', 'diariodecanoas', 'diariodaregiao',
  'diariopopular', 'elpais', 'em', 'exame', 'folhadelondrina',
  'folhadespaulo', 'galileu', 'gazetadopovo', 'gazetaonline', 'gauchazh',
  'jornalnh', 'jornalvs', 'jota', 'nexo', 'nsctotal', 'oestadodespaulo',
  'oglobo', 'pioneiro', 'quatrorodas', 'revistaoeste', 'seudinheiro',
  'superinteressante', 'uol', 'veja', 'observador', 'valoreconomico',
];

const rules = await loadRules();

// The Rules arrive in batches (#420-#423). Drop `todo` once all have merged.
test('every id stored by the current options page has a Rule',
  { todo: 'until #420, #421, #422 and #423 have all merged' }, () => {
    const ids = new Set(rules.map(r => r.id));
    assert.deepEqual(STORED_IDS.filter(id => !ids.has(id)), []);
  });
