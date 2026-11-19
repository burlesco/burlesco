// What each Target does for Época today, before the migration.
//
// userscript: nothing.
// firefox: burlesco/burlesco src/ (v14.0)
//   - content-start.js INJECTION_START.oglobo (document_start, injected
//     <script>, host /globo\.com/) on *.epoca.globo.com (manifest:45):
//     window.hasPaywall = false
//   - It had no switch of its own and obeyed O Globo's. It now has its own id
//     (decided in #415), so it's back on for anyone who had O Globo off.
export default {
  id: 'epoca',
  firefox: {
    siteStart: ['window.hasPaywall = false'],
  },
};
