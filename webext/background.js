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

      // Gazeta do Povo
      "*://*.gazetadopovo.com.br/loader/v1/logan_full_toolbar.js*",

      // Correio Popular
      "*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*",

      // O Estado do Maranhão
      "*://dashboard.tinypass.com/xbuilder/experience/load*",
      "http://assets.imirante.com/2.0/oestadoma/js/jquery.login.min.js",

      // Jornal de Novo Hamburgo
      "*://*.jornalnh.com.br/includes/js/paywall.js*",
      "*://blockv2.fivewall.com.br/*",

      // Diário de Santa Maria
      "*://www.rbsonline.com.br/cdn/scripts/SLoader.js",

      // New York Times
      "*://*.nyt.com/js/mtr.js",

      // Washington Post
      "*://*.washingtonpost.com/*pwapi/*.js*",
      "*://*.washingtonpost.com/*drawbridge/drawbridge.js?_*",

      // O Globo, Exame, Super Interessante, Veja, The Economist
      "*://cdn.tinypass.com/api/tinypass.min.js",

      // UOL
      "*://tm.jsuol.com.br/modules/content-gate.js",

      // GauchaZH
      "*://gauchazh.clicrbs.com.br/static/main*"
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
      "http://jornaldesantacatarina.clicrbs.com.br/jornal/jsp/paywall*"
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

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log(details);
    removeCookies('https://www.ft.com');
  },
  {
    urls: [
      // Financial Times
      "*://*.ft.com/*"
    ]
  }
);

function removeCookies(url) {
  chrome.cookies.getAll({}, function(cookies) {
    cookies.forEach(function(cookie, index, array) {
      chrome.cookies.remove({
        'url': url,
        'name': cookie.name
      });
    });
  });
}

chrome.webRequest.onHeadersReceived.addListener(
  // Block cookies from being set
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
  ['blocking', 'responseHeaders']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    injectHeader('Cookie', '', details.requestHeaders);
    return {requestHeaders: details.requestHeaders};
  },
  {
    urls: [
      // Jornal Nexo
      '*://api.nexojornal.com.br/*'
    ],
    types: ['xmlhttprequest']
  },
  ['blocking', 'requestHeaders']
);

// Referer injection
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    injectHeader(
      'Referer',
      'https://www.google.com.br/',
      details.requestHeaders
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

function injectHeader(name, value, requestHeaders) {
  /**
   * @param {string} name - Name of the header to be inserted
   * @param {string} value - Value of the header to be inserted
   * @param {Object[]} requestHeaders - Provided by webRequest
   *   listeners in callback arg `details.requestHeader`
   * @param {string} requestHeaders[].name
   * @param {string} requestHeaders[].value
   */
  var headerIndex = requestHeaders.findIndex(
    x => x.name.toLowerCase() == name.toLowerCase());

  var newHeader = {name: name, value: value};
  if (headerIndex == -1)
    requestHeaders.push(newHeader);
  else
    requestHeaders[headerIndex] = newHeader;
}
