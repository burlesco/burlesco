// What each Target does for Crusoé today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - document_start, privileged, /crusoe\.com\.br/ (:137-139):
//     document.cookie = 'crs_subscriber=1'. @match crusoe.com.br only (:65).
// firefox: burlesco/burlesco src/ (v14.0)
//   - content-start.js INJECTION_START.crusoe (document_start, injected
//     <script>): the same statement, on crusoe.uol.com.br only (manifest)
//
// Widening, accepted in #415: the Rule matches both domains, so the
// userscript now also runs on crusoe.uol.com.br and the extension on
// crusoe.com.br.
export default {
  id: 'crusoe',
  userscript: {
    privilegedStart: ["document.cookie = 'crs_subscriber=1'"],
  },
  firefox: {
    siteStart: ["document.cookie = 'crs_subscriber=1'"],
  },
};
