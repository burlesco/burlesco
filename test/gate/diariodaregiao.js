// What each Target does for Diário da Região today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - DOMContentLoaded, privileged, /diariodaregiao\.com\.br/ (:343-347):
//     shows the first .noticia-texto and hides .conteudo > .row
// firefox: burlesco/burlesco src/ (v14.0)
//   - content.js INJECTION.diariodaregiao (document_idle, injected
//     <script>): the same statements
const CODE = [
  "getElementsByClassName('noticia-texto')[0].style.display = 'block'",
  "querySelector('.conteudo > .row').style.display = 'none'",
];

export default {
  id: 'diariodaregiao',
  userscript: { privilegedIdle: [CODE] },
  firefox: { siteIdle: [CODE] },
};
