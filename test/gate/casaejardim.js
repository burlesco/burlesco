// What each Target does for Casa e Jardim today, before the migration.
//
// userscript: nothing.
// firefox: burlesco/burlesco src/ (v14.0)
//   - content-start.js INJECTION_START.oglobo (document_start, injected
//     <script>, host /globo\.com/) on *.revistacasaejardim.globo.com
//     (manifest:42): window.hasPaywall = false
//   - It had no switch of its own and obeyed O Globo's. It now has its own id
//     (decided in #415), so it's back on for anyone who had O Globo off.
export default {
  id: 'casaejardim',
  firefox: {
    siteStart: ['window.hasPaywall = false'],
  },
};
