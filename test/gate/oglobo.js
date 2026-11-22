// What each Target does for O Globo today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js (:80),
//     static.infoglobo.com.br/paywall/register-piano/*/scripts/
//     nova-tela-register.js (:81) and static.infoglobo.com.br/paywall/js/
//     tiny.js (:98)
//   - @connect static.infoglobo.com.br and cdn.tinypass.com (:16-17), left
//     from O Globo code removed in 4272f75; kept to keep the header
//   - @match *.oglobo.globo.com (:39) and the resource host
//     ogjs.infoglobo.com.br (:33)
//   - no page code
// firefox: burlesco/burlesco src/ (v14.0)
//   - no network Technique
//   - content-start.js INJECTION_START.oglobo (document_start, injected
//     <script>, host /globo\.com/): window.hasPaywall = false. The manifest
//     also ran it on Época and Casa e Jardim; those now have Rules of their
//     own (decided in #415), so this Rule covers O Globo only.
//   - Host check from matches: the start code also runs on
//     ogjs.infoglobo.com.br pages now (a script host, so in practice never).
export default {
  id: 'oglobo',
  userscript: {
    blockRequests: [{
      urls: [
        '*://ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js',
        '*://static.infoglobo.com.br/paywall/register-piano/*/scripts/nova-tela-register.js',
        '*://static.infoglobo.com.br/paywall/js/tiny.js',
      ],
    }],
    connect: ['static.infoglobo.com.br', 'cdn.tinypass.com'],
  },
  firefox: {
    siteStart: ['window.hasPaywall = false'],
  },
};
