// run_at: document_idle
const ABRIL_CODE = `
  document.querySelectorAll('.callpaywall')
    .forEach(x => x.remove());
  document.querySelectorAll('.content-blocked')
    .forEach(x => x.classList.remove('content-blocked'))
`;

const INJECTION = {
  bloomberg: {
    url: /bloomberg\.com/,
    code: `
      localStorage.clear();
      sessionStorage.clear();
    `
  },
  diariodaregiao: {
    url: /diariodaregiao\.com\.br/,
    code: `
      document.getElementsByClassName('noticia-texto')[0].style.display = 'block';
      document.querySelector('.conteudo > .row').style.display = 'none';
    `
  },
  exame: {
    url: /exame\.abril\.com\.br/,
    code: ABRIL_CODE
  },
  theeconomist: {
    url : /www\.economist\.com/,
    code: 'document.cookie = "ec_limit=allow";'
  },
  foreignpolicy: {
    url: /foreignpolicy\.com/,
    code: `
      document.getElementById("paywall_bg").remove();
      document.body.classList.remove("overlay-no-scroll");
      document.body.style.overflow = "visible";
      document.documentElement.classList.remove("overlay-no-scroll");
    `
  },
  folhadespaulo: {
    url: /folha.uol.com.br/,
    code: `
      omtrClickUOL = function(){};function showText() {
        $("#bt-read-more-content").next().show();
        $("#bt-read-more-content").next().show().prev().remove();
      }
      setTimeout(showText, 100);
    `
  },
  financialtimes: {
    url: /ft.com/,
    code: `
      document.cookie = "";
      localStorage.clear();
      sessionStorage.clear();
      indexedDB.deleteDatabase("next-flags");
      indexedDB.deleteDatabase("next:ads");'
    `
  },
  superinteressante: {
    url: /super.abril.com.br/,
    code: ABRIL_CODE
  },
  veja: {
    url: /veja.abril.com.br/,
    code: ABRIL_CODE
  },
  medium: {
    url: /medium.com/,
    code: `
      console.log('teste');
      document.cookie = "";
      localStorage.clear();
      sessionStorage.clear();
    `
  },
  jota: {
    url: /jota.info/,
    code: `
      document.getElementsByClassName('jota-paywall')[0].remove();
    `
  },
  wired: {
    url: /wired.com/,
    code: `
    window.onload = function() {
      style = document.createElement('style');
      style.type = 'text/css';
      css='.paywall-container-component {display: none !important}';
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }
    document.cookie = "";
    localStorage.clear();
    sessionStorage.clear();
    `
  }
};

chrome.storage.local.get('sites', function(result) {
  for (let site in INJECTION) {
    let enabledSites = result.sites;
    if (enabledSites && enabledSites[site] == false)
      continue;
    if (INJECTION[site] == undefined)
      continue;

    if (INJECTION[site].url.test(document.location.host)) {
      var script = document.createElement('script');
      script.textContent = INJECTION[site].code;
      (document.head||document.documentElement).appendChild(script);
      script.parentNode.removeChild(script);
      break;
    }
  }
});
