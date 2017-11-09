// ==UserScript==
// @name     Burlesco
// @namespace  https://burles.co/
// @version    5.5
// @description  Leia notícias sem ser assinante, burle o paywall
// @author     rodorgas & AugustoResende
// @icon64     https://burles.co/userscript/icon.png
// @include    *://correio.rac.com.br/*
// @include    *://dc.clicrbs.com.br/*
// @include    *://www.economist.com/*
// @include    *://*.estadao.com.br/*
// @include    *://foreignpolicy.com/*
// @include    *://blockv2.fivewall.com.br/*
// @include    *://*.folha.uol.com.br/*
// @include    *://*.folha.com.br/*
// @include    *://gauchazh.clicrbs.com.br/*
// @connect    gauchazh.clicrbs.com.br
// @include    *://api.clicrbs.com.br/*
// @include    *://*.gazetadopovo.com.br/*
// @include    *://assets.imirante.com/*
// @include    *://ogjs.infoglobo.com.br/*
// @include    *://jota.info/*
// @include    *://jornaldesantacatarina.clicrbs.com.br/*
// @include    *://www.jornalnh.com.br/*
// @include    *://*.nexojornal.com.br/*
// @include    *://*.nyt.com/*
// @include    *://*.oglobo.globo.com/*
// @include    *://www.rbsonline.com.br/*
// @include    *://cdn.tinypass.com/*
// @include    *://dashboard.tinypass.com/*
// @include    *://*.washingtonpost.com/*
// @include    *://*.exame.abril.com.br/*
// @include    *://super.abril.com.br/*
// @include    *://veja.abril.com.br/*
// @include    *://*.uol.com.br/*
// @include    *://www.uol/*
// @include    *://*.ft.com/*
// @supportURL   https://github.com/rodorgas/burlesco/
// @grant    GM_webRequest
// @grant    GM_xmlhttpRequest
// @webRequest   [{"selector":{"include":"*://paywall.folha.uol.com.br/*","exclude":"http://paywall.folha.uol.com.br/status.php"},"action":"cancel"},{"selector":"*://static.folha.uol.com.br/paywall/*","action":"cancel"},{"selector":"*://ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js","action":"cancel"},{"selector":"*://*.gazetadopovo.com.br/loader/v1/logan_full_toolbar.js*","action":"cancel"},{"selector":"*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*","action":"cancel"},{"selector":"*://dashboard.tinypass.com/xbuilder/experience/load*","action":"cancel"},{"selector":"http://assets.imirante.com/2.0/oestadoma/js/jquery.login.min.js","action":"cancel"},{"selector":"*://*.jornalnh.com.br/includes/js/paywall.js*","action":"cancel"},{"selector":"*://blockv2.fivewall.com.br/*","action":"cancel"},{"selector":"*://www.rbsonline.com.br/cdn/scripts/SLoader.js","action":"cancel"},{"selector":"*://*.nyt.com/js/mtr.js","action":"cancel"},{"selector":"*://*.washingtonpost.com/*pwapi/*.js*","action":"cancel"},{"selector":"*://*.washingtonpost.com/*drawbridge/drawbridge.js?_*","action":"cancel"},{"selector":"*://cdn.tinypass.com/api/tinypass.min.js","action":"cancel"},{"selector":"*://tm.jsuol.com.br/modules/content-gate.js","action":"cancel"},{"selector":"*://gauchazh.clicrbs.com.br/static/main*","action":"cancel"},{"selector":"http://dc.clicrbs.com.br/jornal-2015/jsp/paywall.jspx*","action":"cancel"},{"selector":"http://jornaldesantacatarina.clicrbs.com.br/jornal/jsp/paywall*","action":"cancel"}]
// @run-at     document-start
// ==/UserScript==

// GauchaZH
if (/gauchazh.clicrbs.com.br/.test(document.location.host)) {
  document.addEventListener("DOMContentLoaded", function(event) {
    function patchJs(jsurl) {
      GM_xmlhttpRequest({
        method: "GET",
        url: jsurl,
        onload: function(response) {
          var injectme = this.responseText;
          injectme = injectme.replace('e.showLoginPaywall,','false,');
          injectme = injectme.replace('e.showPaywall,','false,');
          injectme = injectme.replace('e.requestCPF||!1,','false,');
          injectme = injectme.replace('!e.showLoginPaywall&&!e.showPaywall||!1','true');
          var script = document.createElement("script");
          script.type = "text/javascript";
          var textNode = document.createTextNode(injectme);
          script.appendChild(textNode);
          document.head.appendChild(script);

        }
      });
    }
    patchJs(document.getElementsByTagName('script')[1].src);
  });
}

// JOTA
else if (/jota.info/.test(document.location.host)) {
  document.cookie = "articles=null;path=/";
}

// run_at: document_idle
document.addEventListener("DOMContentLoaded", function(event) {
  var codeld = null;
  if (/([^\/].)?oglobo\.globo\.com/.test(document.location.host))
    codeld = 'paywallAtivo = false;';

  else if (/www\.economist\.com/.test(document.location.host))
    codeld = 'document.cookie = "ec_limit=allow";';

  else if (/foreignpolicy\.com/.test(document.location.host)) {
    codeld = `
      document.getElementById("paywall_bg").remove();
      document.body.classList.remove("overlay-no-scroll");
      document.body.style.overflow = "visible";
      document.documentElement.classList.remove("overlay-no-scroll");
    `;
  }

  else if (/folha.uol.com.br/.test(document.location.host)) {
    codeld = `
      omtrClickUOL = function(){};function showText() {
         $("#bt-read-more-content").next().show();
         $("#bt-read-more-content").next().show().prev().remove();
      }
      setTimeout(showText, 100);
    `;
  }

  else if (/nexojornal.com.br/.test(document.location.host)) {
    codeld = `
      paywallContainer = document.getElementsByClassName('new-paywall-container')[0];
      paywallContent = paywallContainer.getAttribute('data-paywall-content');
      nexoApiURL = paywallContainer.getAttribute('data-paywall-check');
      xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 200 || this.status == 201 || this.status == 401)) {
          access_token = JSON.parse(this.responseText)['access_token'];
          paywallContainer.className = 'wf-placeholder';
          paywallContainer.setAttribute('data-loadURL', paywallContent.replace('{access_token}', access_token));
          paywallContainer.setAttribute('data-skip-profiles', '');
          WFLazyLoader.loadFragment()
        }
      };
      xmlhttp.open('GET', nexoApiURL, true);
      xmlhttp.send();`;
  }
  else if (/ft.com/.test(document.location.host)) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.href,
      headers: {
        'Referer': 'https://www.google.com.br/'
      },
      anonymous: true,
      onload: function(response) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(this.responseText,'text/html');
        var injectme = htmlDoc.getElementsByTagName('html')[0].innerHTML;
        if (document.getElementsByClassName('trial-subs__heading-pretext')[0]) {
          document.write(injectme);
        }
      }
    });
  }

  if (codeld !== null) {
    var script = document.createElement('script');
    script.textContent = codeld;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  }
});