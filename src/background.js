// Script blocking
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return {cancel: true};
  },
  {
    urls: [
      // O Estado de S. Paulo
      "*://*.estadao.com.br/paywall/*",

      // Folha de S.Paulo
      "*://paywall.folha.uol.com.br/*",
      "*://static.folha.uol.com.br/paywall/*",

      // O Globo
      "*://ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js",
      "*://cdn.tinypass.com/api/tinypass.min.js",

      // Gazeta do Povo
      "*://*.gazetadopovo.com.br/loader/v1/logan_full_toolbar.js*",

      // Zero Hora
      "*://zh.clicrbs.com.br/it/js/paid-content-config.js*",
      "*://www.rbsonline.com.br/cdn/scripts/paywall.min.js*",

      // Correio Popular
      "*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*",

      // O Estado do Maranhão
      "*://dashboard.tinypass.com/xbuilder/experience/load*",
      "http://assets.imirante.com/2.0/oestadoma/js/jquery.login.min.js",

      // Jornal de Novo Hamburgo
      "*://www.jornalnh.com.br/includes/js/paywall.js*",
      "*://blockv2.fivewall.com.br/*",

      // Diário de Santa Maria
      "*://www.rbsonline.com.br/cdn/scripts/SLoader.js"
    ],
    types: ["script"]
  },
  ["blocking"]
);

// XHR blocking
WHITELIST = [
  'http://paywall.folha.uol.com.br/status.php'
];
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (WHITELIST.indexOf(details.url) !== -1)
      return {cancel: false};
    else
      return {cancel: true};
  },
  {
    urls: [
      // Folha de S.Paulo
      "*://paywall.folha.uol.com.br/*",
      "*://static.folha.uol.com.br/paywall/*",

      // Diário Catarinense
      "http://dc.clicrbs.com.br/jornal-2015/jsp/paywall.jspx*",

      // Jornal de Santa Catarina
      "http://jornaldesantacatarina.clicrbs.com.br/jornal/jsp/paywall*",

      // O Globo
      "*://cdn.tinypass.com/api/tinypass.min.js"
    ],
    types: ["xmlhttprequest"]
  },
  ["blocking"]
);

// Cookie blocking
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    chrome.cookies.remove({
      'url': 'http://jota.info/*',
      'name': 'articles'
    });
  },
  {
    urls: [
      // JOTA
      "http://jota.info/*"
    ],
    types: ["main_frame"]
  }
);

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    details.responseHeaders.forEach(function(responseHeader) {
      if (responseHeader.name.toLowerCase() == "set-cookie") {
        responseHeader.value = '';
      }
    });
    return {
      responseHeaders: details.responseHeaders
    };
  },
  {
    urls: [
      // Financial Times
      "*://*.ft.com/*"
    ]
  },
  ['blocking','responseHeaders']
);

// Referer injection
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var headers = ['Referer'];

    headers.forEach(header =>
      insertHeader(
        header,
        'https://www.google.com.br/',
        details.requestHeaders
      )
    );

    return {requestHeaders: details.requestHeaders};
  },
  {
    urls: [
      // Financial Times
      "*://www.ft.com/*"
    ],
    types: ["xmlhttprequest", "main_frame"]
  },
  ["blocking", "requestHeaders"]
);

function insertHeader(name, value, requestHeaders) {
  /**
   * @param {string} name - Name of the header to be inserted
   * @param {string} value - Value of the header to be inserted
   * @param {Object[]} requestHeaders - Provided by webRequest
   *   listeners in callback arg `details.requestHeader`
   * @param {string} requestHeaders[].name
   * @param {string} requestHeaders[].value
   */
  var headerIndex = requestHeaders.findIndex(x => x.name == name);

  var newHeader = {name: name, value: value};
  if (headerIndex == -1)
    requestHeaders.push(newHeader);
  else
    requestHeaders[headerIndex] = newHeader;
}
