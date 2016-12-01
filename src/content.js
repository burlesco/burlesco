var code = null;
if (/([^\/].)?oglobo\.globo\.com/.test(document.location.host))
    code = 'paywallAtivo = false;';

else if (/www\.economist\.com/.test(document.location.host))
    code = 'document.cookie = "ec_limit=allow";';

else if (/foreignpolicy\.com/.test(document.location.host)) {
    code = 'window.FPMarketingSettings.__meta.disable_paywall = true;';
    code += 'window.Drupal.settings.ec_wallpage.ec_wallpage_paywall_name = ' +
        '"article paywall registered"';
}

if (code !== null) {
    code = 'console.log("Burlando paywall com Burlesco");' + code;
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}
