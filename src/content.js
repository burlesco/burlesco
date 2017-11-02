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
  code = 'var tm = true;\
    function carreganoticia() {\
        var xhttp = new XMLHttpRequest();\
        xhttp.onreadystatechange = function() {\
            if (this.readyState == 4 && this.status == 200) {\
                var parser= new DOMParser();\
                var htmlDoc= parser.parseFromString(this.responseText,"text/html");\
                var injectme = htmlDoc.getElementsByClassName("paid-content-apply")[0].innerHTML;\
                document.getElementsByClassName("paid-content-apply")[0].innerHTML = injectme;\
            }\
        };\
        xhttp.open("GET", window.location.href, true);\
        xhttp.send();\
    }\
    function checkBloqueio() {\
        setInterval(function() {\
            if (tm !== false){\
                setTimeout(function() {clearInterval(checkBloqueio);}, 5000);\
                tm = false;\
            }\
            var myElem = document.getElementsByClassName("wrapper-paid-content")[0];\
            if (myElem !== undefined) {\
                document.cookie = "";\
                localStorage.clear();\
                carreganoticia();\
            }\
        }, 500);\
    }\
    checkBloqueio();\
    function onClick() {\
        document.cookie = "";\
        localStorage.clear();\
        tm = true;\
        checkBloqueio();\
    }\
    var html = document.getElementsByTagName("html");\
    html.onclick = onClick();';
}

if (code !== null) {
  var script = document.createElement('script');
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}
