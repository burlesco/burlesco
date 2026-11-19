// Diário da Região: show the article text and hide what covers it. Same
// code on both Targets, in different environments.

// Self-contained, so both sections can use it.
const showArticle = () => {
  document.getElementsByClassName('noticia-texto')[0].style.display = 'block';
  document.querySelector('.conteudo > .row').style.display = 'none';
};

export default {
  id: 'diariodaregiao',
  name: 'Diário da Região',
  matches: ['*://*.diariodaregiao.com.br/*'],

  userscript: { privilegedIdle: showArticle },
  firefox: { siteIdle: showArticle },
};
