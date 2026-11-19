// What each Target does for GaúchaZH today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem gauchazh.clicrbs.com.br/static/signwall.*.min.js (:104)
//   - @connect gauchazh.clicrbs.com.br and gauchazh.clicrbs.com.br. (:14-15);
//     no current code uses them
//   - DOMContentLoaded, /gauchazh\.clicrbs\.com\.br/ (:190-226), injected
//     <script>: rebuilds the article from __ISOMORPHIC_DATA__, then appends
//     `script` where it means `style` (#428), which throws in the page
//   - @match also lists *.zh.clicrbs.com.br and api.clicrbs.com.br (:30-31),
//     where nothing runs. They are not in the Rule's matches, because the
//     page code would then run there too; the header loses those 2 lines.
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.gauchazh: scriptBlocking of the same signwall
//   - content.js INJECTION.gauchazh (document_idle, injected <script>): the
//     same code, with the same bug
export default {
  id: 'gauchazh',
  userscript: {
    blockRequests: [
      { urls: ['*://gauchazh.clicrbs.com.br/static/signwall.*.min.js'] },
    ],
    connect: ['gauchazh.clicrbs.com.br', 'gauchazh.clicrbs.com.br.'],
    siteIdle: [[
      '__ISOMORPHIC_DATA__',
      'article_body_components',
      "insertAdjacentHTML('afterend', content)",
      'stopImmediatePropagation',
      '.paid-content-template::before { display: none; }',
      '.appendChild(script)',
    ]],
  },
  firefox: {
    blockRequests: [{
      urls: ['*://gauchazh.clicrbs.com.br/static/signwall.*.min.js'],
      types: ['script'],
    }],
    siteIdle: [[
      '__ISOMORPHIC_DATA__',
      'article_body_components',
      "insertAdjacentHTML('afterend', content)",
      'stopImmediatePropagation',
      '.paid-content-template::before { display: none; }',
      '.appendChild(script)',
    ]],
  },
};
