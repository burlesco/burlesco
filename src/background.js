const WHITELIST = {
  folhadespaulo: {
    xhrBlocking: [
      'http://paywall.folha.uol.com.br/status.php',
      'https://paywall.folha.uol.com.br/status.php'
    ]
  }
};

const BLOCKLIST = {
  brpolitico: {
    xhrBlocking: [
      '*://*.estadao.com.br/paywall/*',
    ]
  },
  correio24horas: {
    scriptBlocking: [
      '*://correio-static.cworks.cloud/vendor/bower_components/paywall.js/paywall.js*',
    ]
  },
  correiopopular: {
    scriptBlocking: [
      '*://correio.rac.com.br/includes/js/novo_cp/fivewall.js*',
    ]
  },
  diarinho: {
    xhrBlocking: [
      '*://*.diarinho.com.br/wp-admin/admin-ajax.php',
    ]
  },
  diariodecanoas: {
    xhrBlocking: [
      '*://*.fivewall.com.br/*',
    ]
  },
  diariopopular: {
    cookieBlocking: {
      urlFilter: '*://www.diariopopular.com.br/*',
      blockAll: true
    }
  },
  elpais: {
    scriptBlocking: [
      '*://prisa-el-pais-brasil-prod.cdn.arcpublishing.com/arc/subs/p.js',
      '*://prisa-el-pais-prod.cdn.arcpublishing.com/arc/subs/p.js',
      '*://brasil.elpais.com/pf/resources/dist/js/article.js*'
    ]
  },
  exame: {
    scriptBlocking: [
      '*://exame.com/wp-content/themes/exame-new/js/pywll.js',
      '*://exame.com/wp-content/themes/exame-new/js/extd-acc.js?v=*'
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
    ],
  },
  folhadelondrina: {
    scriptBlocking: [
      '*://www.folhadelondrina.com.br/login.php*',
    ],
    xhrBlocking: [
      '*://www.folhadelondrina.com.br/login.php*',
    ],
  },
  gazetadopovo: {
    scriptBlocking: [
      '*://www.netdeal.com.br/*',
    ]
  },
  gazetaonline: {
    cookieBlocking: {
      urlFilter: '*://www.gazetaonline.com.br/*',
      blockAll: true
    }
  },
  gauchazh: {
    scriptBlocking: [
      '*://gauchazh.clicrbs.com.br/static/signwall.*.min.js'
    ]
  },
  jornalnh: {
    scriptBlocking: [
      '*://*.fivewall.com.br/*',
    ]
  },
  jornalvs: {
    scriptBlocking: [
      '*://*.fivewall.com.br/*',
    ]
  },
  jota: {
    headerInjection: {
      name: 'User-Agent',
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      urlFilter: '*://www.jota.info/*'
    }
  },
  nexo: {
    xhrBlocking: [
      'https://acesso.nexojornal.com.br/paywall/*'
    ]
  },
  nsctotal: {
    xhrBlocking: [
      'https://paywall.nsctotal.com.br/behaviors',
    ],
    scriptBlocking: [
      '*://*.tinypass.com/*'
    ]
  },
  oestadodespaulo: {
    xhrBlocking: [
      '*://*.estadao.com.br/paywall/*',
    ],
    scriptBlocking: [
      '*://*.estadao.com.br/paywall/*',
      '*://*.zephr.com/zephr-browser/*/zephr-browser.umd.js',
    ]
  },
  pioneiro: {
    scriptBlocking: [
      '*://www.rbsonline.com.br/cdn/scripts/SLoader.js',
    ]
  },
  quatrorodas: {
    scriptBlocking: [
      'https://*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*',
    ]
  },
  revistaoeste: {
    scriptBlocking: [
      '*://revistaoeste.com/wp-content/uploads/custom-css-js/248859.js?v=*',
      '*://revistaoeste.com/wp-content/themes/revistaoeste/assets/js/main.js?ver=*'
    ]
  },
  seudinheiro: {
    scriptBlocking: [
      'https://*.seudinheiro.com/app/themes/seudinheiro/src/js/lib/premium-home.js*',
      'https://*.seudinheiro.com/app/themes/seudinheiro/js/premium-production.js*',
    ]
  },
  superinteressante: {
    scriptBlocking: [
      'https://*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*',
    ]
  },
  uol: {
    scriptBlocking: [
      '*://tm.jsuol.com.br/modules/content-gate.js',
    ],
    headerInjection: {
      name: 'User-Agent',
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
      urlFilter: '*://noticias.uol.com.br/midiaglobal/nytimes/*'
    }
  },
  valoreconomico: {
    scriptBlocking: [
      '*://static.infoglobo.com.br/paywall/js/*',
    ]
  },
  veja: {
    scriptBlocking: [
      'https://*.abril.com.br/wp-content/plugins/abril-plugins/abril-paywall/js/paywall.js*',
    ]
  },
  observador: {
    scriptBlocking: [
      '*://*.tinypass.com/*',
    ]
  }
};

function generateRules(enabledSites) {
  let rules = [];
  let nextRuleId = 1;

  for (let item in BLOCKLIST) {
    if (enabledSites && enabledSites[item] === false) continue;

    let siteConfig = BLOCKLIST[item];

    if (siteConfig.scriptBlocking) {
      for (let url of siteConfig.scriptBlocking) {
        rules.push({
          id: nextRuleId++,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: url,
            resourceTypes: ['script']
          }
        });
      }
    }

    if (siteConfig.xhrBlocking) {
      for (let url of siteConfig.xhrBlocking) {
        rules.push({
          id: nextRuleId++,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: url,
            resourceTypes: ['xmlhttprequest']
          }
        });
      }
    }

    if (siteConfig.cookieBlocking) {
      let cookie = siteConfig.cookieBlocking;
      rules.push({
        id: nextRuleId++,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'Cookie', operation: 'remove' }
          ],
          responseHeaders: [
            { header: 'Set-Cookie', operation: 'remove' }
          ]
        },
        condition: {
          urlFilter: cookie.urlFilter,
          resourceTypes: ['xmlhttprequest', 'script', 'main_frame']
        }
      });
    }

    if (siteConfig.headerInjection) {
      let header = siteConfig.headerInjection;
      rules.push({
        id: nextRuleId++,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: header.name, operation: 'set', value: header.value }
          ]
        },
        condition: {
          urlFilter: header.urlFilter,
          resourceTypes: ['xmlhttprequest', 'main_frame']
        }
      });
    }
  }

  for (let item in WHITELIST) {
    if (enabledSites && enabledSites[item] === false) continue;
    
    let siteConfig = WHITELIST[item];
    if (siteConfig.xhrBlocking) {
      for (let url of siteConfig.xhrBlocking) {
        rules.push({
          id: nextRuleId++,
          priority: 2, 
          action: { type: 'allow' },
          condition: {
            urlFilter: url,
            resourceTypes: ['xmlhttprequest']
          }
        });
      }
    }
  }

  return rules;
}

async function apply() {
  chrome.storage.local.get('sites', async function(result) {
    let enabledSites = result.sites;
    let newRules = generateRules(enabledSites);
    
    let oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    let oldRuleIds = oldRules.map(r => r.id);
    
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRuleIds,
      addRules: newRules
    });
  });
}

const INJECTION_START = {
  crusoe: function() { document.cookie = 'crs_subscriber=1'; },
  diariograndeabc: function() {
    var email = "colaborador@dgabc.com.br";
    localStorage.emailNoticiaExclusiva = email;
    if (window.jQuery) {
      window.jQuery('.NoticiaExclusivaNaoLogado, .NoticiaExclusivaLogadoSemPermissao').hide();
      window.jQuery('.linhaSuperBanner, .footer, .NoticiaExclusivaLogado').show();
    } else {
      document.querySelectorAll('.NoticiaExclusivaNaoLogado, .NoticiaExclusivaLogadoSemPermissao').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.linhaSuperBanner, .footer, .NoticiaExclusivaLogado').forEach(el => el.style.display = 'block');
    }
  },
  em: function() {
    window.id_acesso_noticia=0;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('.news-blocked { display: none !important } .news-blocked-no-scroll { overflow: auto !important; width: auto !important; position: unset !important; } div[itemprop="articleBody"] { height: auto !important; }'));
    document.head.appendChild(style);
  },
  oglobo: function() { window.hasPaywall = false; },
  nexo: function() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('body { overflow: auto !important; } div[class*="PaywallBumper__wrap-container"], div[class*="Datawall__wrap-container"] { display: none !important; }'));
    document.head.appendChild(style);
  }
};

const ABRIL_CODE = function() {
  window.setTimeout(function() {
    let b = document.querySelector('body');
    if(b) b.classList.remove('disabledByPaywall');
    let o = document.querySelector('.piano-offer-overlay');
    if(o) o.remove();
    let p = document.querySelector('#piano_offer');
    if(p) p.remove();
  }, 10000);
};

const INJECTION = {
  correio24horas: function() {
    if (window.jQuery) {
      window.jQuery('[class^=paywall]').remove();
      window.jQuery('[class$=blocked]').removeClass();
      window.jQuery('[id^=paywall]').removeClass('hide is-active').remove();
      window.jQuery('.noticias-single__content__text').attr('style', 'height:auto;');
    } else {
      document.querySelectorAll('[class^="paywall"]').forEach(el => el.remove());
      document.querySelectorAll('[class$="blocked"]').forEach(el => el.className = '');
      document.querySelectorAll('[id^="paywall"]').forEach(el => { el.classList.remove('hide', 'is-active'); el.remove(); });
      document.querySelectorAll('.noticias-single__content__text').forEach(el => el.style.height = 'auto');
    }
  },
  diariodaregiao: function() {
    let el = document.getElementsByClassName('noticia-texto')[0];
    if (el) el.style.display = 'block';
    let row = document.querySelector('.conteudo > .row');
    if (row) row.style.display = 'none';
  },
  exame: ABRIL_CODE,
  folhadespaulo: function() {
    window.omtrClickUOL = function(){};
    function showText() {
      let btn = document.querySelector("#bt-read-more-content");
      if (btn) {
         let next = btn.nextElementSibling;
         if (next) {
            next.style.display = 'block';
            let prev = next.previousElementSibling;
            if (prev) prev.remove();
         }
      }
    }
    setTimeout(showText, 100);
  },
  galileu: function() {
    const cleanGalileu = () => {
      const div = document.querySelector('#detecta-adblock');
      if (div) div.remove();
      document.body.style.overflow = 'initial';
    };
    cleanGalileu();
    setTimeout(cleanGalileu, 4000);
  },
  gauchazh: function() {
    (async () => {
      if (!window.__ISOMORPHIC_DATA__) return;
      const data = JSON.parse(decodeURI(window.__ISOMORPHIC_DATA__)).state.apollo.ROOT_QUERY;
      const key = Object.keys(data).filter(key => key.includes('article'))[0];
      if(!key || !data[key].article_body_components) return;
      
      const parts = data[key].article_body_components
        .map(item => `<div class="article-paragraph">${item.html || item.data.embed}</div>`);
      const content = parts.reduce((acc, curr) => acc + curr, '');
      
      while (true) {
        const article = document.querySelector('.article-paragraph');
        if (article === null) {
           await new Promise(r => setTimeout(r, 1000));
           continue;
        }
        article.insertAdjacentHTML('afterend', content);
        document.querySelectorAll('.article-paragraph').forEach(item => {
          item.style.opacity = '1';
        });
        document.querySelectorAll('a').forEach(item => {
          item.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            return false;
          });
        });
        let style = document.createElement('style');
        style.textContent = '.paid-content-template::before { display: none; }';
        document.head.appendChild(style);
        break;
      }
    })();
  },
  nexo: function() {
    const selectors = [
      "div[class*='PaywallBumper__wrap-container']",
      "div[class*='Datawall__wrap-container']"
    ];
    selectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) element.remove();
    });
  },
  seudinheiro: function() {
    let p = document.querySelector('#premium-paywall');
    if (p) p.remove();
    document.body.style.overflow = '';
  },
  superinteressante: ABRIL_CODE,
  valoreconomico: function() {
    const element = document.querySelector('[class*="paywall"]');
    if (element) element.remove();
  },
  veja: ABRIL_CODE,
  jota: function() {
    let p = document.getElementsByClassName('jota-paywall')[0];
    if (p) p.remove();
  },
  observador: function() {
    let p = document.querySelector('.piano-article-blocker');
    if (p) p.remove();
    let a = document.querySelector('.article-body-wrapper');
    if (a) a.style.maxHeight = 'inherit';
    let p2 = document.querySelector('.premium-article');
    if (p2) p2.classList.add('article-shown');
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'executeScript' && sender.tab) {
    let func = null;
    if (message.type === 'start') {
      func = INJECTION_START[message.site];
    } else {
      func = INJECTION[message.site];
    }
    if (func) {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        world: 'MAIN',
        func: func
      }).catch(e => console.error(e));
    }
  } else if (message === 'update') {
    apply();
  }
});

chrome.runtime.onInstalled.addListener(apply);
chrome.runtime.onStartup.addListener(apply);
