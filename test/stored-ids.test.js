// Every Site the pre-migration extension and userscript served must have a
// Rule (#415, #425). The old sources are gone, so what they covered is kept
// here as data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadRules } from '../build/load-rules.js';
import { matchPatternToRegExp } from '../build/match-pattern.js';

// SITES in the extension's src/options.js (v14.0). People's saved on/off
// choices are keyed by these ids, so each must still name a Rule.
const STORED_IDS = [
  'brpolitico', 'correio24horas', 'correiopopular', 'crusoe',
  'diarioabcpaulista', 'diarinho', 'diariodecanoas', 'diariodaregiao',
  'diariopopular', 'elpais', 'em', 'exame', 'folhadelondrina',
  'folhadespaulo', 'galileu', 'gazetadopovo', 'gazetaonline', 'gauchazh',
  'jornalnh', 'jornalvs', 'jota', 'nexo', 'nsctotal', 'oestadodespaulo',
  'oglobo', 'pioneiro', 'quatrorodas', 'revistaoeste', 'seudinheiro',
  'superinteressante', 'uol', 'veja', 'observador', 'valoreconomico',
];

// Every Site the userscript @matched (burlesco/userscript
// src/burlesco.user.js, v14.2), with the Rule that now serves it and a page
// of each of its @match patterns. Resource hosts it @matched only so
// @webRequest could reach them (fivewall, infoglobo, netdeal, tinypass,
// clicrbs APIs) are not Sites.
const USERSCRIPT_SITES = {
  bloomberg: ['https://www.bloomberg.com/'],
  correiopopular: ['https://correio.rac.com.br/'],
  nsctotal: ['https://www.nsctotal.com.br/'],
  economist: ['https://www.economist.com/'],
  oestadodespaulo: ['https://www.estadao.com.br/'],
  foreignpolicy: ['https://foreignpolicy.com/'],
  folhadespaulo: ['https://www1.folha.uol.com.br/', 'https://www.folha.com.br/'],
  gauchazh: ['https://gauchazh.clicrbs.com.br/'],
  gazetadopovo: ['https://www.gazetadopovo.com.br/'],
  jota: ['https://www.jota.info/'],
  jornalnh: ['https://www.jornalnh.com.br/'],
  nytimes: ['https://www.nytimes.com/'],
  oglobo: ['https://oglobo.globo.com/'],
  washingtonpost: ['https://www.washingtonpost.com/'],
  exame: ['https://exame.com/'],
  eltiempo: ['https://www.eltiempo.com/'],
  superinteressante: ['https://super.abril.com.br/'],
  veja: ['https://veja.abril.com.br/'],
  quatrorodas: ['https://quatrorodas.abril.com.br/'],
  uol: ['https://www.uol.com.br/', 'https://www.uol/'],
  wsj: ['https://www.wsj.com/'],
  ft: ['https://www.ft.com/'],
  gramophone: ['https://www.gramophone.co.uk/'],
  folhadelondrina: ['https://www.folhadelondrina.com.br/'],
  wired: ['https://www.wired.com/'],
  jornalvs: ['https://www.jornalvs.com.br/'],
  br18: ['https://br18.com.br/'],
  diariopopular: ['https://www.diariopopular.com.br/'],
  haaretz: ['https://www.haaretz.com/', 'https://www.haaretz.co.il/'],
  diarinho: ['https://diarinho.com.br/'],
  diariodaregiao: ['https://www.diariodaregiao.com.br/'],
  correio24horas: ['https://www.correio24horas.com.br/'],
  diarioabcpaulista: ['https://www.dgabc.com.br/'],
  crusoe: ['https://crusoe.com.br/'],
  em: ['https://www.em.com.br/'],
  forbespl: ['https://www.forbes.pl/', 'https://www.newsweek.pl/'],
  forbes: ['https://www.forbes.com/'],
  seudinheiro: ['https://www.seudinheiro.com/'],
  diariodecanoas: ['https://www.diariodecanoas.com.br/'],
  observador: ['https://observador.pt/'],
  elpais: ['https://brasil.elpais.com/'],
  correiodopovo: ['https://www.correiodopovo.com.br/'],
  technologyreview: ['https://www.technologyreview.com/'],
  galileu: ['https://revistagalileu.globo.com/'],
};

const rules = await loadRules();
const byId = new Map(rules.map(r => [r.id, r]));

test('every id stored by the old options page has a Rule', () => {
  assert.deepEqual(STORED_IDS.filter(id => !byId.has(id)), []);
});

test('every Site the old userscript served has a Rule matching its pages', () => {
  const missing = [];
  for (const [id, pages] of Object.entries(USERSCRIPT_SITES)) {
    const rule = byId.get(id);
    for (const page of pages) {
      const covered = rule?.matches.some(p => matchPatternToRegExp(p).test(page));
      if (!covered) missing.push(`${id}: ${page}`);
    }
  }
  assert.deepEqual(missing, []);
});
