chrome.webRequest.onBeforeRequest.addListener(
    function(details) { return {cancel: true}; },
    {
        urls: [
            "*://*.estadao.com.br/paywall/*",
            "*://*.folha.uol.com.br/folha/furniture/paywall/*"
        ],
        types: ["script"]
    },
    ["blocking"]
);
