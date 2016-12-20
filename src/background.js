chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {cancel: true};
    },
    {
        urls: [
            "*://*.estadao.com.br/paywall/*",

            "*://paywall.folha.uol.com.br/*",
            "*://static.folha.uol.com.br/paywall/*",

            "*://*.globo.com/plataforma/js/*/minificados/paywall/controla-acesso.js",

            "*://*.gazetadopovo.com.br/conta/public/js/connect_api.js*",
            "*://*.gazetadopovo.com.br/conta/going/api/paywall/*",

            "*://zh.clicrbs.com.br/it/js/paid-content-config.js*",

            "*://www.rbsonline.com.br/cdn/scripts/paywall.min.js*",

            "*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*",

            "*://dashboard.tinypass.com/xbuilder/experience/load*"
        ],
        types: ["script"]
    },
    ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {cancel: true};
    },
    {
        urls: [
            "http://dc.clicrbs.com.br/jornal-2015/jsp/paywall.jspx*",
            "http://jornaldesantacatarina.clicrbs.com.br/jornal/jsp/paywall*"

        ],
        types: ["xmlhttprequest"]
    },
    ["blocking"]
);
