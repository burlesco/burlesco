// run_at: document_start
const INJECTION_START = {
  crusoe: {
    url : /crusoe.uol.com.br/,
    code: `
      document.cookie = 'crs_subscriber=1';
    `
  },
  diariograndeabc: {
    url : /dgabc.com.br/,
    code: `
      var email = "colaborador@dgabc.com.br";
      var senha = "";
      localStorage.emailNoticiaExclusiva = email;
      $('.NoticiaExclusivaNaoLogado').hide();
      $('.NoticiaExclusivaLogadoSemPermissao').hide();
      $('.linhaSuperBanner').show();
      $(".footer").show();
      $('.NoticiaExclusivaLogado').show();
    `
  },
  em: {
    url: /em\.com\.br/,
    code: `
      window.id_acesso_noticia=0

      style = document.createElement('style')
      style.type = 'text/css'

      css=\`
        .news-blocked {
          display: none !important
        }

        .news-blocked-no-scroll {
          overflow: auto !important;
          width: auto !important;
          position: unset !important;
        }

        div[itemprop="articleBody"] {
          height: auto !important;
        }
      \`;

      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
    `
  },
  oglobo: {
    url: /globo\.com/,
    code: `
      window.hasPaywall = false
    `
  },
  nexo: {
    url: /nexojornal\.com\.br/,
    code: `
      style = document.createElement('style')
      style.type = 'text/css'

      const css = \`
        body {
          overflow: auto !important;
        }

        div[class*='PaywallBumper__wrap-container'],
        div[class*='Datawall__wrap-container'] {
          display: none !important;
        }
      \`;

      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
    `
  },
};

chrome.storage.local.get('sites', function(result) {
  for (let site in INJECTION_START) {
    let enabledSites = result.sites;
    if (enabledSites && enabledSites[site] == false)
      continue;
    if (INJECTION_START[site] == undefined)
      continue;

    if (INJECTION_START[site].url.test(document.location.host)) {
      var script = document.createElement('script');
      script.textContent = INJECTION_START[site].code;
      (document.head||document.documentElement).appendChild(script);
      script.parentNode.removeChild(script);
      break;
    }
  }
});
