const SITES = [
  'br18',
  'correiopopular',
  'diarinho',
  'diariocatarinense',
  'diariodaregiao',
  'diariopopular',
  'exame',
  'folhadelondrina',
  'folhadespaulo',
  'gazetadopovo',
  'gazetaonline',
  'gauchazh',
  'jornaldesantacatarina',
  'jornalnh',
  'jornalvs',
  'jota',
  'nexo',
  'oestadodespaulo',
  'oglobo',
  'pioneiro',
  'quatrorodas',
  'superinteressante',
  'uol',
  'veja',
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
