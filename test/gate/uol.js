// What each Target does for UOL today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem tm.jsuol.com.br/modules/content-gate.js (:90)
//   - @match *.uol.com.br and www.uol (:49-50); no page code
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.uol: scriptBlocking of content-gate.js;
//     headerInjection of an iPhone User-Agent on
//     *://noticias.uol.com.br/midiaglobal/nytimes/* (main_frame and
//     xmlhttprequest)
//   - no page code
//
// Overlap: *.uol.com.br also covers Folha (folha.uol.com.br) and Crusoé
// (crusoe.uol.com.br). Every matching Rule runs now, but UOL has no page
// code and its network Techniques are keyed on their own URLs, so the
// overlap only repeats @match lines. Nothing more runs on those Sites.
export default {
  id: 'uol',
  userscript: {
    blockRequests: [{ urls: ['*://tm.jsuol.com.br/modules/content-gate.js'] }],
  },
  firefox: {
    blockRequests: [{
      urls: ['*://tm.jsuol.com.br/modules/content-gate.js'],
      types: ['script'],
    }],
    setRequestHeader: [{
      urls: ['*://noticias.uol.com.br/midiaglobal/nytimes/*'],
      name: 'User-Agent',
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    }],
  },
};
