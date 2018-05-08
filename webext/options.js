const SITES = [
  'correiopopular',
  'diariocatarinense',
  'diariodesantamaria',
  'exame',
  'financialtimes',
  'folhadespaulo',
  'foreignpolicy',
  'gazetadopovo',
  'gauchazh',
  'gramophone',
  'jornaldesantacatarina',
  'jornalnh',
  'jota',
  'nexo',
  'oestadodespaulo',
  'oestadodomaranhao',
  'oglobo',
  'quatrorodas',
  'superinteressante',
  'theeconomist',
  'thenewyorktimes',
  'thewallstreetjournal',
  'thewashingtonpost',
  'uol',
  'veja'
];

function saveOptions(e) {
  function showUpdateSucess() {
    document.querySelector('#save-success').style.display = 'inline-block';
    setTimeout(function() {
      document.querySelector('#save-success').style.display = 'none';
    }, 3000);
  }

  e.preventDefault();

  let siteStatus = {};
  for (let site of SITES)
    siteStatus[site] = document.querySelector('#' + site).checked;

  chrome.storage.local.set({sites: siteStatus});
  chrome.runtime.sendMessage('update');

  showUpdateSucess();
}

function restoreOptions() {
  function setCurrentSite(site, status) {
    document.querySelector('#' + site).checked = status;
  }

  chrome.storage.local.get('sites', function(result) {
    for (let site in result.sites)
      setCurrentSite(site, result.sites[site]);
  });
}

function changeAll(check) {
  let inputs = document.querySelectorAll('input[type="checkbox"]');
  for (let input of inputs) {
    input.checked = check;
  }
}
function checkNone() {
  changeAll(false);
}
function checkAll() {
  changeAll(true);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('#all').addEventListener('click', checkAll);
document.querySelector('#none').addEventListener('click', checkNone);
