// run_at: document_idle
const SITES_IDLE = {
  correio24horas: /correio24horas\.com\.br/,
  diariodaregiao: /diariodaregiao\.com\.br/,
  exame: /exame\.com\.br/,
  folhadespaulo: /folha.uol.com.br/,
  galileu: /revistagalileu\.globo\.com/,
  gauchazh: /gauchazh.clicrbs.com.br/,
  nexo: /nexojornal\.com\.br/,
  seudinheiro: /seudinheiro.com/,
  superinteressante: /super.abril.com.br/,
  valoreconomico: /valor.globo.com/,
  veja: /veja.abril.com.br/,
  jota: /jota.info/,
  observador: /observador\.pt/
};

chrome.storage.local.get('sites', function(result) {
  let enabledSites = result.sites || {};
  for (let site in SITES_IDLE) {
    if (enabledSites[site] === false) continue;
    if (SITES_IDLE[site].test(document.location.host)) {
      chrome.runtime.sendMessage({ action: 'executeScript', type: 'idle', site: site });
      break;
    }
  }
});
