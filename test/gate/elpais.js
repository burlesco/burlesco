// What each Target does for EL PAÍS today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem the two arcpublishing subs/p.js and brasil.elpais.com
//     article.js* (:101-103)
//   - @connect brasil.elpais.com (:19); no current code uses it
//   - no page code
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.elpais: scriptBlocking of the same 3 URLs
//   - no page code
const URLS = [
  '*://prisa-el-pais-brasil-prod.cdn.arcpublishing.com/arc/subs/p.js',
  '*://prisa-el-pais-prod.cdn.arcpublishing.com/arc/subs/p.js',
  '*://brasil.elpais.com/pf/resources/dist/js/article.js*',
];

export default {
  id: 'elpais',
  userscript: {
    blockRequests: [{ urls: URLS }],
    connect: ['brasil.elpais.com'],
  },
  firefox: {
    blockRequests: [{ urls: URLS, types: ['script'] }],
  },
};
