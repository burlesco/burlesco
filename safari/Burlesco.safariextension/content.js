// start script
var code = null;

if (/oglobo\.globo\.com/.test(document.location.host))
  code = 'paywallAtivo = false;';

else if (/www\.economist\.com/.test(document.location.host))
  code = 'document.cookie = "ec_limit=allow";';

else if (/foreignpolicy\.com/.test(document.location.host)) {
  code = `
    if (window.self === window.top) {
      var i = 0;
      var interval = window.setInterval(function() {
        i++;
        if (i == 10000) window.clearInterval(interval);

        var paywallBg = document.getElementById("paywall_bg");
        if (paywallBg !== null) {
          paywallBg.remove();
          document.body.classList.remove("overlay-no-scroll");
          document.body.style.overflow = "visible";
          document.documentElement.classList.remove("overlay-no-scroll");
          window.clearInterval(interval);
        }
      }, 500);
    }
  `;
}

else if (/folha.uol.com.br/.test(document.location.host)) {
  code = `
    omtrClickUOL = function(){};function showText() {\
      $("#bt-read-more-content").next().show();\
      $("#bt-read-more-content").next().show().prev().remove();\
    } \
    setTimeout(showText, 100);
  `;
}

else if (/gauchazh.clicrbs.com.br/.test(document.location.host)) {
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

else if (/ft.com/.test(document.location.host)) {
  localStorage.clear();
  sessionStorage.clear();
  indexedDB.deleteDatabase("next-flags");
  indexedDB.deleteDatabase("next:ads");

  var newElement = document.createElement("a");
  newElement.textContent = "Clique para burlar essa notícia";
  newElement.style.float = "right";
  newElement.onclick = function() {
    document.location.href =
      'https://www.google.com.br/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&url=' +
      encodeURIComponent(document.location.href);
  };
  document.body.insertBefore(newElement, document.body.firstChild);
}

else if (/veja.abril.com.br/.test(document.location.host)) {
  document.querySelector('.content-blocked').classList.remove('content-blocked');
  document.querySelector('.callpaywall').remove();
}

if (code !== null) {
  var script = document.createElement('script');
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}
