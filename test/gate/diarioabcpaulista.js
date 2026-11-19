// What each Target does for DGABC (Diário do Grande ABC) today, before the
// migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - DOMContentLoaded, /dgabc\.com\.br/ (:391-402), injected <script>:
//     sets localStorage.emailNoticiaExclusiva, hides the not-logged-in
//     notices and shows the logged-in content (jQuery $)
// firefox: burlesco/burlesco src/ (v14.0)
//   - content-start.js INJECTION_START.diariograndeabc (document_start,
//     injected <script>): the same code
//   - The code key isn't the stored id (diarioabcpaulista), so the switch
//     never worked. The Rule uses the stored id, so it does now (spec #415).
//   - The old code declared `var email` and an unused `var senha` at the top
//     of the injected script, which made them page globals. The Rule keeps
//     the email local and drops senha.
const CODE = [
  "localStorage.emailNoticiaExclusiva = 'colaborador@dgabc.com.br'",
  "$('.NoticiaExclusivaNaoLogado').hide()",
  "$('.NoticiaExclusivaLogadoSemPermissao').hide()",
  "$('.linhaSuperBanner').show()",
  "$('.footer').show()",
  "$('.NoticiaExclusivaLogado').show()",
];

export default {
  id: 'diarioabcpaulista',
  userscript: {
    siteIdle: [CODE],
  },
  firefox: {
    siteStart: [CODE],
  },
};
