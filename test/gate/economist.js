// What each Target does for The Economist today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match www.economist.com
//   - DOMContentLoaded, /www\.economist\.com/ host check, injected <script>:
//     saves article.article's innerHTML and polls every 100 ms for
//     .layout-article-regwall, then restores it. (A first assignment of
//     'document.cookie = "ec_limit=allow"' is overwritten and never runs.)
// firefox: not supported.
export default {
  id: 'economist',
  userscript: {
    siteIdle: [[
      "document.querySelector('article.article')",
      "document.querySelector('.layout-article-regwall')",
      'artBodyContainer.innerHTML = artBody',
      'setTimeout(checkPaywall, 100)',
    ]],
  },
};
