// run_at: document_start
const INJECTION = {
  gauchazh: {
    url : /gauchazh.clicrbs.com.br/,
    code: `
      function patchJs(jsurl) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var injectme = this.responseText;
            injectme = injectme.replace('t.showLoginPaywall,', 'false,');
            injectme = injectme.replace('t.showPaywall,', 'false,');
            injectme = injectme.replace('t.requestCPF||!1,', 'false,');
            injectme = injectme.replace(
              '!t.showLoginPaywall&&!t.showPaywall||!1', 'true');
            var script = document.createElement("script");
            script.type = "text/javascript";
            var textNode = document.createTextNode(injectme);
            script.appendChild(textNode);
            document.head.appendChild(script);
          }
        };
        xhttp.open("GET", jsurl, true);
        xhttp.send();
      }

      document.addEventListener("DOMContentLoaded", function(event) {
        var scripts = Array.from(document.getElementsByTagName('script'));
        var script = scripts.find((el) => {
          return el.src.includes('static/main')
        });
        if (script)
          patchJs(script.src);
      });
    `
  },
  oglobo: {
    url: /oglobo\.globo\.com/,
    code: `
      function patchJs(jsurl) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var injectme = this.responseText;
            injectme = injectme.replace('window.conteudoExclusivo?!0:!1', 'false');
            var script = document.createElement("script");
            script.type = "text/javascript";
            var textNode = document.createTextNode(injectme);
            script.appendChild(textNode);
            document.head.appendChild(script);
          }
        };
        xhttp.open("GET", jsurl, true);
        xhttp.send();
      }

      document.addEventListener("DOMContentLoaded", function(event) {
        var scripts = Array.from(document.getElementsByTagName('script'));
        var script = scripts.find((el) => {
          return el.src.includes('js/tiny.js')
        });
        if (script)
          patchJs(script.src);
      });
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
