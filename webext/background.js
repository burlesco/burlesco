const WHITELIST = {
  folhadespaulo: {
    xhrBlocking: [
      'http://paywall.folha.uol.com.br/status.php',
      'https://paywall.folha.uol.com.br/status.php'
    ]
  },
  oglobo: {
    scriptBlocking: [
      '*://static.infoglobo.com.br/paywall/register-piano/v1/scripts/nova-tela-register.js',
    ]
  }
};

const BLOCKLIST = {
  correiopopular: {
    scriptBlocking: [
      '*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*',
    ]
  },
  diariocatarinense: {
    xhrBlocking: [
      'http://dc.clicrbs.com.br/jornal-2015/jsp/paywall.jspx*',
    ]
  },
  diariodesantamaria: {
    scriptBlocking: [
      '*://www.rbsonline.com.br/cdn/scripts/SLoader.js',
    ]
  },
  exame: {
    scriptBlocking: [
      '*://cdn.tinypass.com/api/tinypass.min.js',
    ]
  },
  folhadespaulo: {
    scriptBlocking: [
      '*://paywall.folha.uol.com.br/*',
      '*://static.folha.uol.com.br/paywall/*',
    ],
    xhrBlocking: [
      '*://paywall.folha.uol.com.br/*',
      '*://static.folha.uol.com.br/paywall/*',
    ]
  },
  financialtimes: {
    cookieBlocking: {
      urlFilter: '*://*.ft.com/*',
      blockAll: true
    },
    headerInjection: {
      name: 'Referer',
      value: 'https://www.google.com.br/',
      urlFilter: '*://www.ft.com/*'
    }
  },
  gazetadopovo: {
    scriptBlocking: [
      '*://www.netdeal.com.br/*',
    ]
  },
  gauchazh: {
    scriptBlocking: [
      '*://gauchazh.clicrbs.com.br/static/main*',
      '*://www.rbsonline.com.br/cdn/scripts/special-paywall.min.js*',
      '*://www.rbsonline.com.br/cdn/scripts/paywall.min.js*',
    ]
  },
  gramophone: {
    scriptBlocking: [
      '*://api.tinypass.com/tpl/*',
    ]
  },
  jornaldesantacatarina: {
    scriptBlocking: [
      'http://jornaldesantacatarina.clicrbs.com.br/jornal/jsp/paywall*'
    ]
  },
  jornalnh: {
    scriptBlocking: [
      '*://*.jornalnh.com.br/includes/js/paywall.js*',
      '*://blockv2.fivewall.com.br/*',
    ]
  },
  jota: {
    cookieBlocking: {
      urlFilter: 'http://jota.info/*',
      cookie: {
        url: 'http://jota.info/*',
        name: 'articles'
      }
    }
  },
  medium: {
    cookieBlocking: {
      urlFilter: 'https://medium.com/*',
      blockAll: true
    }
  },
  nexo: {
    cookieBlocking: {
      urlFilter: '*://api.nexojornal.com.br/*',
      blockAll: true
    }
  },
  oestadodespaulo: {
    xhrBlocking: [
      '*://*.estadao.com.br/paywall/*',
    ]
  },
  oestadodomaranhao: {
    xhrBlocking: [
      '*://dashboard.tinypass.com/xbuilder/experience/load*',
      'http://assets.imirante.com/2.0/oestadoma/js/jquery.login.min.js',
    ]
  },
  pioneiro: {
    scriptBlocking: [
      '*://www.rbsonline.com.br/cdn/scripts/SLoader.js',
    ]
  },
  quatrorodas: {
    scriptBlocking: [
      '*://cdn.tinypass.com/api/tinypass.min.js',
    ]
  },
  superinteressante: {
    scriptBlocking: [
      '*://cdn.tinypass.com/api/tinypass.min.js',
    ]
  },
  theeconomist: {
    scriptBlocking: [
      '*://cdn.tinypass.com/api/tinypass.min.js',
    ]
  },
  thenewyorktimes: {
    scriptBlocking: [
      '*://*.nytimes.com/js/mtr.js',
      '*://*.nyt.com/js/mtr.js',
    ]
  },
  thewashingtonpost: {
    scriptBlocking: [
      '*://*.washingtonpost.com/*pwapi/*.js*',
      '*://*.washingtonpost.com/*drawbridge/drawbridge.js?_*',
    ]
  },
  thewallstreetjournal: {
    cookieBlocking: {
      urlFilter: '*://*.wsj.com/*',
      blockAll: true
    },
    headerInjection: {
      name: 'Referer',
      value: 'https://www.facebook.com/',
      urlFilter: '*://*.wsj.com/*'
    }
  },
  uol: {
    scriptBlocking: [
      '*://tm.jsuol.com.br/modules/content-gate.js',
    ]
  },
  veja: {
    scriptBlocking: [
      '*://cdn.tinypass.com/api/tinypass.min.js',
    ]
  }
};

function onBeforeRequestScript() {
  return {cancel: true};
}

function setScriptBlocking(enabledSites) {
  let urlFilters = [];

  for (let item in BLOCKLIST) {
    let script = BLOCKLIST[item].scriptBlocking;
    if (enabledSites && enabledSites[item] == false)
      continue;
    if (script == undefined)
      continue;
    urlFilters = urlFilters.concat(script);
  }

  chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequestScript,
    {
      urls: urlFilters,
      types: ['script']
    },
    ['blocking']
  );
}

let whitelist = [];
function onBeforeRequestXml(details) {
  if (whitelist.indexOf(details.url) !== -1)
    return {cancel: false};
  else
    return {cancel: true};
}
function setXhrBlocking(enabledSites) {
  let blocklist = [];

  for (let item in BLOCKLIST) {
    let xhr = BLOCKLIST[item].xhrBlocking;
    if (xhr == undefined)
      continue;
    if (enabledSites && enabledSites[item] == false)
      continue;
    blocklist = blocklist.concat(xhr);
  }

  for (let item in WHITELIST) {
    if (enabledSites && enabledSites[item] == false)
      continue;
    let xhr = BLOCKLIST[item].xhrBlocking;
    if (xhr == undefined)
      continue;
    whitelist = whitelist.concat(xhr);

  }

  chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequestXml,
    {
      urls: blocklist,
      types: ['xmlhttprequest']
    },
    ['blocking']
  );
}

function onHeadersReceivedCookie(details) {
  details.responseHeaders.forEach(function(responseHeader) {
    if (responseHeader.name.toLowerCase() == 'set-cookie') {
      responseHeader.value = '';
    }
  });
  return {
    responseHeaders: details.responseHeaders
  };
}
function onBeforeSendHeadersCookie(details) {
  injectHeader('Cookie', '', details.requestHeaders);
  return {requestHeaders: details.requestHeaders};
}

function makeCookieRemove(cookie) {
  return function() {
    chrome.cookies.remove(cookie);
  };
}
let callbacksOnBeforeRequestCookie = [];


function setCookieBlocking(enabledSites) {
  let urlFilters = [];

  for (let item in BLOCKLIST) {
    let cookie = BLOCKLIST[item].cookieBlocking;
    if (cookie == undefined)
      continue;
    if (enabledSites && enabledSites[item] == false)
      continue;

    if (cookie.blockAll) {
      urlFilters.push(cookie.urlFilter);
    }
    else {
      let callback = makeCookieRemove(cookie.cookie);
      callbacksOnBeforeRequestCookie.push(callback);
      chrome.webRequest.onBeforeRequest.addListener(
        callback,
        {
          urls: [cookie.urlFilter],
          types: ['xmlhttprequest', 'script', 'main_frame']
        }
      );
    }
  }


  chrome.webRequest.onHeadersReceived.addListener(
    onHeadersReceivedCookie,
    {
      urls: urlFilters,
      types: ['xmlhttprequest', 'script', 'main_frame']
    },
    ['blocking', 'responseHeaders']
  );

  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeadersCookie,
    {
      urls: urlFilters,
      types: ['xmlhttprequest', 'script', 'main_frame']
    },
    ['blocking', 'requestHeaders']
  );
}
function makeInjectHeader(name, value) {
  return function(details) {
    injectHeader(
      name,
      value,
      details.requestHeaders
    );
    return {requestHeaders: details.requestHeaders};
  };
}
let callbacksOnBeforeSendHeadersInjection = [];

function setHeaderInjection(enabledSites) {
  for (let item in BLOCKLIST) {
    let header = BLOCKLIST[item].headerInjection;
    if (header == undefined)
      continue;
    if (enabledSites && enabledSites[item] == false)
      continue;

    let callback = makeInjectHeader(header.name, header.value);
    callbacksOnBeforeSendHeadersInjection.push(callback);
    chrome.webRequest.onBeforeSendHeaders.addListener(
      callback,
      {
        urls: [
          header.urlFilter
        ],
        types: ['xmlhttprequest', 'main_frame']
      },
      ['blocking', 'requestHeaders']
    );
  }
}

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

function apply() {
  chrome.storage.local.get('sites', function(result) {
    let enabledSites = result.sites;

    setScriptBlocking(enabledSites);
    setXhrBlocking(enabledSites);
    setCookieBlocking(enabledSites);
    setHeaderInjection(enabledSites);
  });
}

function removeListeners() {
  chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestScript);
  chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestXml);
  chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceivedCookie);
  chrome.webRequest.onBeforeSendHeaders.removeListener(
    onBeforeSendHeadersCookie);
  for (let item of callbacksOnBeforeRequestCookie)
    chrome.webRequest.onBeforeRequest.removeListener(item);
  for (let item of callbacksOnBeforeSendHeadersInjection)
    chrome.webRequest.onBeforeSendHeaders.removeListener(item);
}

apply();
chrome.runtime.onMessage.addListener(function(message) {
  if (message == 'update') {
    removeListeners();
    apply();
  }
});
