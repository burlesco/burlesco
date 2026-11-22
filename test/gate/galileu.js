// What each Target does for Galileu today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - DOMContentLoaded, run directly (privileged, :468-476): cleanGalileu
//     removes #detecta-adblock and sets body overflow to initial, now and
//     again after 4 s
//   - @match *.revistagalileu.globo.com (:76)
// firefox: burlesco/burlesco src/ (v14.0)
//   - content.js INJECTION.galileu (document_idle, injected <script>): the
//     same code. It never ran: the manifest gave content.js no match for
//     revistagalileu.globo.com, only a host permission. With content scripts
//     generated from matches it now runs, a behaviour change like Exame's.
//   - options.js knew the id but options.html had no checkbox for it
export default {
  id: 'galileu',
  userscript: {
    privilegedIdle: [['#detecta-adblock', "overflow = 'initial'", '4000']],
  },
  firefox: {
    siteIdle: [['#detecta-adblock', "overflow = 'initial'", '4000']],
  },
};
