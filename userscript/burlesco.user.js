// ==UserScript==
// @name         Burlesco
// @namespace    https://burles.co/
// @version      5.7
// @description  Leia notícias sem ser assinante, burle o paywall
// @author       rodorgas & AugustoResende
// @supportURL   https://burles.co
// @icon64       https://burles.co/userscript/icon.png
// Atenção:      Caso algum site não funcione logo após a instalação, limpe o cache do navegador.
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @connect      gauchazh.clicrbs.com.br
// @match        *://correio.rac.com.br/*
// @match        *://dc.clicrbs.com.br/*
// @match        *://www.economist.com/*
// @match        *://*.estadao.com.br/*
// @match        *://foreignpolicy.com/*
// @match        *://blockv2.fivewall.com.br/*
// @match        *://*.folha.uol.com.br/*
// @match        *://*.folha.com.br/*
// @match        *://gauchazh.clicrbs.com.br/*
// @match        *://*.zh.clicrbs.com.br/*
// @match        *://api.clicrbs.com.br/*
// @match        *://*.gazetadopovo.com.br/*
// @match        *://assets.imirante.com/*
// @match        *://ogjs.infoglobo.com.br/*
// @match        *://jota.info/*
// @match        *://jornaldesantacatarina.clicrbs.com.br/*
// @match        *://www.jornalnh.com.br/*
// @match        *://*.nexojornal.com.br/*
// @match        *://*.nyt.com/*
// @match        *://*.oglobo.globo.com/*
// @match        *://www.rbsonline.com.br/*
// @match        *://cdn.tinypass.com/*
// @match        *://dashboard.tinypass.com/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.exame.abril.com.br/*
// @match        *://super.abril.com.br/*
// @match        *://veja.abril.com.br/*
// @match        *://quatrorodas.abril.com.br/*
// @match        *://*.uol.com.br/*
// @match        *://www.uol/*
// @match        *://*.ft.com/*

// @webRequest   [{"selector":{"include":"*://paywall.folha.uol.com.br/*","exclude":"http://paywall.folha.uol.com.br/status.php"},"action":"cancel"},{"selector":"*://static.folha.uol.com.br/paywall/*","action":"cancel"},{"selector":"*://ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js","action":"cancel"},{"selector":"*://*.gazetadopovo.com.br/loader/v1/logan_full_toolbar.js*","action":"cancel"},{"selector":"*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*","action":"cancel"},{"selector":"*://dashboard.tinypass.com/xbuilder/experience/load*","action":"cancel"},{"selector":"http://assets.imirante.com/2.0/oestadoma/js/jquery.login.min.js","action":"cancel"},{"selector":"*://*.jornalnh.com.br/includes/js/paywall.js*","action":"cancel"},{"selector":"*://blockv2.fivewall.com.br/*","action":"cancel"},{"selector":"*://www.rbsonline.com.br/cdn/scripts/SLoader.js","action":"cancel"},{"selector":"*://*.nyt.com/js/mtr.js","action":"cancel"},{"selector":"*://*.washingtonpost.com/*pwapi/*.js*","action":"cancel"},{"selector":"*://*.washingtonpost.com/*drawbridge/drawbridge.js?_*","action":"cancel"},{"selector":"*://cdn.tinypass.com/api/tinypass.min.js","action":"cancel"},{"selector":"*://tm.jsuol.com.br/modules/content-gate.js","action":"cancel"},{"selector":"*://gauchazh.clicrbs.com.br/static/main*","action":"cancel"},{"selector":"*://www.rbsonline.com.br/cdn/scripts/special-paywall.min.js*","action":"cancel"},{"selector":"http://dc.clicrbs.com.br/jornal-2015/jsp/paywall.jspx*","action":"cancel"},{"selector":"http://jornaldesantacatarina.clicrbs.com.br/jornal/jsp/paywall*","action":"cancel"},{"selector":"*://*.estadao.com.br/paywall/*","action":"cancel"}]
// @run-at       document-start
// @noframes
// ==/UserScript==

// run_at: document_start
if (/gauchazh.clicrbs.com.br/.test(document.location.host)) {
  document.addEventListener('DOMContentLoaded', function() {
    function patchJs(jsurl) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: jsurl,
        onload: function(response) {
          var injectme = response.responseText;
          injectme = injectme.replace('e.showLoginPaywall,','false,');
          injectme = injectme.replace('e.showPaywall,','false,');
          injectme = injectme.replace('e.requestCPF||!1,','false,');
          injectme = injectme.replace('!e.showLoginPaywall&&!e.showPaywall||!1','true');
          var script = document.createElement('script');
          script.type = 'text/javascript';
          var textNode = document.createTextNode(injectme);
          script.appendChild(textNode);
          document.head.appendChild(script);
        }
      });
    }

    var scripts = Array.from(document.getElementsByTagName('script'));
    var script = scripts.find((el) => { return el.src.includes('static/main'); });
    if (script)
      patchJs(script.src);
  });

  window.onload = function() {
    function check(){
      if(document.getElementsByClassName('wrapper-paid-content')[0]){
        document.getElementsByClassName('wrapper-paid-content')[0].innerHTML = '<p>Por favor aperte Ctrl-F5 para carregar o restante da notícia!</p>';
      }
      setTimeout(function(){ check(); }, 1000);
    }
    check();
  };
}

else if (/jota.info/.test(document.location.host)) {
  document.cookie = 'articles=null;path=/';
}

// run_at: document_idle
document.addEventListener('DOMContentLoaded', function() {
  var code = null;
  if (/oglobo\.globo\.com/.test(document.location.host))
    code = 'paywallAtivo = false;';

  else if (/www\.economist\.com/.test(document.location.host))
    code = 'document.cookie = "ec_limit=allow";';

  else if (/ft.com/.test(document.location.host)
      && document.querySelector('.barrier')) {

    var cookieList  = document.cookie.split (/;\s*/);
    for (var J = cookieList.length - 1;   J >= 0;  --J) {
      var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, '$1');
      eraseCookie (cookieName);
    }

    document.cookie = '';
    localStorage.clear();
    sessionStorage.clear();
    indexedDB.deleteDatabase('next-flags');
    indexedDB.deleteDatabase('next:ads');

    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.href,
      headers: {
        'Referer': 'https://www.google.com.br/'
      },
      anonymous: true,
      onload: function(response) {
        var parser = new DOMParser();
        var newDocument = parser.parseFromString(response.responseText,'text/html');
        if (newDocument.getElementsByClassName('article__content')[0]) {
          document.open();
          document.write(newDocument.getElementsByTagName('html')[0].innerHTML);
          document.close();
        }
      }
    });
  }


  else if (/foreignpolicy\.com/.test(document.location.host)) {
    code = `
      document.getElementById("paywall_bg").remove();
      document.body.classList.remove("overlay-no-scroll");
      document.body.style.overflow = "visible";
      document.documentElement.classList.remove("overlay-no-scroll");
    `;
  }

  else if (/folha.uol.com.br/.test(document.location.host)) {
    code = `
      omtrClickUOL = function(){};function showText() {
         $("#bt-read-more-content").next().show();
         $("#bt-read-more-content").next().show().prev().remove();
      }
      setTimeout(showText, 100);
    `;
  }

  else if (/nexojornal.com.br/.test(document.location.host)) {
    code = `
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

  else if (/veja.abril.com.br/.test(document.location.host))
    code = `
      document.querySelector('.content-blocked').classList.remove('content-blocked');
      document.querySelector('.callpaywall').remove();
    `;

  if (code !== null) {
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  }
});


function eraseCookie (cookieName) {
  // https://stackoverflow.com/a/28081337/1840019
  //--- ONE-TIME INITS:
  //--- Set possible domains. Omits some rare edge cases.?.
  var domain      = document.domain;
  var domain2     = document.domain.replace (/^www\./, '');
  var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, '$2');

  //--- Get possible paths for the current page:
  var pathNodes   = location.pathname.split ('/').map ( function (pathWord) {
    return '/' + pathWord;
  } );
  var cookPaths   = [''].concat (pathNodes.map ( function (pathNode) {
    if (this.pathStr) {
      this.pathStr += pathNode;
    }
    else {
      this.pathStr = '; path=';
      return (this.pathStr + pathNode);
    }
    return (this.pathStr);
  } ) );

  // eslint-disable-next-line no-func-assign
  ( eraseCookie = function (cookieName) {
    //--- For each path, attempt to delete the cookie.
    cookPaths.forEach ( function (pathStr) {
      //--- To delete a cookie, set its expiration date to a past value.
      var diagStr     = cookieName + '=' + pathStr + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      document.cookie = diagStr;

      document.cookie = cookieName + '=' + pathStr + '; domain=' + domain  + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      document.cookie = cookieName + '=' + pathStr + '; domain=' + domain2 + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      document.cookie = cookieName + '=' + pathStr + '; domain=' + domain3 + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
    } );
  } ) (cookieName);
}
