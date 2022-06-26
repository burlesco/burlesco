// run_at: document_start
const INJECTION = {
  crusoe: {
    url : /crusoe.com.br/,
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
  gauchazh: {
    url : /gauchazh.clicrbs.com.br/,
    code: `
      document.addEventListener('DOMContentLoaded', function() {
        function patchJs(jsurl) {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var injectme = this.responseText;
              injectme = injectme.replace(
                /![a-z].showLoginPaywall&&![a-z].showPaywall\\|\\|!1/g, 'true');
              injectme = injectme.replace('throw new Error("only one instance of babel-polyfill is allowed");', '');
              var script = document.createElement("script");
              script.type = "text/javascript";
              var textNode = document.createTextNode(injectme);
              script.appendChild(textNode);
              document.head.appendChild(script);
            }
          };
          xhttp.open("GET", jsurl.replace('.com.br', '.com.br.'), true);
          xhttp.send();
        }

        const scripts = Array.from(document.getElementsByTagName('script'));
        const script = scripts.find((el) => { return el.src.includes('static/main'); });
        if (script) {
          patchJs(script.src);
        }
      });

      window.onload = function() {
        function check(){
          if(document.getElementsByClassName('wrapper-paid-content')[0]){
            document.getElementsByClassName('wrapper-paid-content')[0].innerHTML = '<p>Por favor aperte Ctrl-F5 para carregar o restante da notícia!</p>';
          }
          setTimeout(function(){ check(); }, 5000);
        }
        check();
      };

      const cleanPaywallTracking = () => {
        document.cookie = 'pwsi__zh=;domain=.clicrbs.com.br;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
        localStorage.removeItem('pwsi__zh');
        sessionStorage.removeItem('pwsi__zh');
      };
      cleanPaywallTracking();
      setTimeout(cleanPaywallTracking, 5000);
      document.body.addEventListener('click', cleanPaywallTracking, true);
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
