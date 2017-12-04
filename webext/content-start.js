// run_at: document_start
var code = null;

if (/gauchazh.clicrbs.com.br/.test(document.location.host)) {
  code = `
    function patchJs(jsurl) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
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
      };
      xhttp.open("GET", jsurl, true);
      xhttp.send();
    }

    document.addEventListener("DOMContentLoaded", function(event) {
      var scripts = Array.from(document.getElementsByTagName('script'));
      var script = scripts.find((el) => { return el.src.includes('static/main') });
      if (script)
        patchJs(script.src);
    });
  `;
}

if (code !== null) {
  var script = document.createElement('script');
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}
