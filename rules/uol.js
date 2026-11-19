// UOL. The extension also asks for the mobile page of UOL's New York Times
// translations, which has no paywall.
//
// *.uol.com.br also covers Folha and Crusoé. That's harmless while UOL has
// no page code: its Techniques act on their own URLs, not on the Site.
// Give UOL page code only together with a way to keep it off those Sites.
export default {
  id: 'uol',
  name: 'UOL',
  matches: ['*://*.uol.com.br/*', '*://www.uol/*'],

  blockRequests: [{
    urls: ['*://tm.jsuol.com.br/modules/content-gate.js'],
    types: ['script'],
  }],

  firefox: {
    setRequestHeader: {
      urls: ['*://noticias.uol.com.br/midiaglobal/nytimes/*'],
      name: 'User-Agent',
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    },
  },
};
