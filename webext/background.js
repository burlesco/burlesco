chrome.storage.local.get('sites', function(result) { {
}
  let enabledSites = result.sites;
});

const WHITELIST = {
  folha: {
    xhrBlocking: [
      'http://paywall.folha.uol.com.br/status.php',
      'https://paywall.folha.uol.com.br/status.php'
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
      cookie: 'https://www.ft.com',
      blockAll: true;
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
        'url': 'http://jota.info/*',
        'name': 'articles'
      }
    }
  },
  nexo: {
    cookieBlocking: {
      urlFilter: '*://api.nexojornal.com.br/*'
    }
  }
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
  oglobo: {
    scriptBlocking: [
      '*://ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js',
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
      cookie: 'https://www.wsj.com',
      blockAll: true;
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

function setScriptBlocking(enabledSites) {
  let filterUrls = [];

  for (item of blocklist) {
    let cookie = blocklist[item].scriptBlocking;
    if (item.scriptBlocking == undefined)
      continue
    if (enabledSites[item] == false)
      continue;

    filterUrls = filterUrls.concat(item.scriptBlocking);
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function() {
      return {cancel: true};
    },
    {
      urls: [
        filterUrls
      ],
      types: ['script']
    },
    ['blocking']
  );
}

function setXhrBlocking(enabledSites) {
  let blocklist=[], whitelist=[];

  for (let item of BLOCKLIST) {
    let script = blocklist[item].scriptBlocking;
    if (script == undefined)
      continue;
    if (enabledSites[item] == false)
      continue;

    blocklist = blocklist.concat(script);
  }
  for (let item of WHITELIST) {
    let script = blocklist[item].scriptBlocking;
    if (item.scriptBlocking == undefined)
      continue;
    if (enabledSites[item] == false)
      continue;

    whitelist = whitelist.concat(script);
  }

  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (whitelist.indexOf(details.url) !== -1)
        return {cancel: false};
      else
        return {cancel: true};
    },
    {
      urls: blocklist,
      types: ['xhr']
    },
    ['blocking']
  );
}

function setCookieBlocking() {
  for (let item in blocklist) {
    let cookie = blocklist[item].cookieBlocking;

    if (cookie.cookieBlocking == undefined)
      continue;
    if (enabledSites[item] == false)
      continue;

    if (typeof cookie.cookie == String) {
      chrome.webRequest.onBeforeRequest.addListener(
        function() {
          removeAllCookies(cookie.cookie);
        },
        {
          urls: [cookie.urlFilter]
        }
      );
    }
    else {
      chrome.webRequest.onBeforeRequest.addListener(
        function() {
          chrome.cookies.remove(cookie.cookie);
        },
        {
          urls: [item.urlFilter],
          types: ['main_frame']
        }
      );
    }

    if (cookie.blockAll) {
      chrome.webRequest.onHeadersReceived.addListener(
        function (details) {
          details.responseHeaders.forEach(function(responseHeader) {
            if (responseHeader.name.toLowerCase() == 'set-cookie') {
              responseHeader.value = '';
            }
          });
          return {
            responseHeaders: details.responseHeaders
          };
        },
        {
          urls: [
            cookie.urlFilter
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
    }
  }
}



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
      '*://www.ft.com/*'
    ],
    types: ['xmlhttprequest', 'main_frame']
  },
  ['blocking', 'requestHeaders']
);


chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    injectHeader(
      'Referer',
      'https://www.facebook.com/',
      details.requestHeaders
    );

    return {requestHeaders: details.requestHeaders};
  },
  {
    urls: [
      // The Wall Street Journal
      '*://*.wsj.com/*'
    ],
    types: ['xmlhttprequest', 'main_frame']
  },
  ['blocking', 'requestHeaders']
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

function removeAllCookies(url) {
  chrome.cookies.getAll({}, function(cookies) {
    cookies.forEach(function(cookie) {
      chrome.cookies.remove({
        'url': url,
        'name': cookie.name
      });
    });
  });
}

