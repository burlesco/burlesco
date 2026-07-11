// run_at: document_start
const SITES_START = {
  crusoe: /crusoe.uol.com.br/,
  diariograndeabc: /dgabc.com.br/,
  em: /em\.com\.br/,
  oglobo: /globo\.com/,
  nexo: /nexojornal\.com\.br/
};

chrome.storage.local.get('sites', function(result) {
  let enabledSites = result.sites || {};
  for (let site in SITES_START) {
    if (enabledSites[site] === false) continue;
    if (SITES_START[site].test(document.location.host)) {
      chrome.runtime.sendMessage({ action: 'executeScript', type: 'start', site: site });
      break;
    }
  }
});
