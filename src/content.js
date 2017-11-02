// run_at: document_idle
var code = null;
if (/([^\/].)?oglobo\.globo\.com/.test(document.location.host))
  code = 'paywallAtivo = false;';

else if (/www\.economist\.com/.test(document.location.host))
  code = 'document.cookie = "ec_limit=allow";';

else if (/foreignpolicy\.com/.test(document.location.host)) {
  code = '\
    document.getElementById("paywall_bg").remove();\
    document.body.classList.remove("overlay-no-scroll");\
    document.body.style.overflow = "visible";\
    document.documentElement.classList.remove("overlay-no-scroll");\
  ';
}

else if (/folha.uol.com.br/.test(document.location.host)) {
  code = 'omtrClickUOL = function(){};function showText() {\
            $("#bt-read-more-content").next().show();\
            $("#bt-read-more-content").next().show().prev().remove();\
          } \
          setTimeout(showText, 100);';
}

else if (/ft.com/.test(document.location.host)) {
  code = 'document.cookie = "";\
          localStorage.clear();\
          sessionStorage.clear();\
          indexedDB.deleteDatabase("next-flags");\
          indexedDB.deleteDatabase("next:ads");';
}

else if (/gauchazh.clicrbs.com.br/.test(document.location.host)) {
  code = `
    function loadArticle() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var parser = new DOMParser();
          var htmlDoc = parser.parseFromString(this.responseText,'text/html');
          var injectme = htmlDoc.getElementsByClassName('paid-content-apply')[0].innerHTML;
          document.getElementsByClassName('paid-content-apply')[0].innerHTML = injectme;
        }
      };
      xhttp.open('GET', window.location.href, true);
      xhttp.send();
    }

    function checkPaywall() {
      setInterval(function() {
        var paywall = document.getElementsByClassName('wrapper-paid-content')[0];
        if (paywall) {
          localStorage.clear();
          loadArticle();
        }
      }, 1000);
    }

    function deleteAllCookies() {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }

    function clearPersistentData() {
      localStorage.clear();
      sessionStorage.clear();
      deleteAllCookies();
    }

    checkPaywall();
    document.getElementsByTagName('html')[0].onclick = clearPersistentData();
    `;
}

if (code !== null) {
  var script = document.createElement('script');
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}
