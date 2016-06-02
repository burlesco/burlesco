var code = null;
if (/.*\.oglobo\.globo\.com/.test(document.location.host)) {
    code = 'paywallAtivo = false;';
}

if (code !== null) {
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}