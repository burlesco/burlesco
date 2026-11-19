// DGABC (Diário do Grande ABC) shows exclusive articles to anyone who looks
// logged in. Both Targets run the same code, at different moments.

// Self-contained, so both sections can use it.
const showExclusive = () => {
  localStorage.emailNoticiaExclusiva = 'colaborador@dgabc.com.br';
  $('.NoticiaExclusivaNaoLogado').hide();
  $('.NoticiaExclusivaLogadoSemPermissao').hide();
  $('.linhaSuperBanner').show();
  $('.footer').show();
  $('.NoticiaExclusivaLogado').show();
};

export default {
  id: 'diarioabcpaulista',
  name: 'Diário ABC Paulista',
  matches: ['*://*.dgabc.com.br/*'],

  userscript: { siteIdle: showExclusive },
  firefox: { siteStart: showExclusive },
};
