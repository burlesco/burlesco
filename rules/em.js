// Estado de Minas: mark the article as free to read and hide the paywall
// with a stylesheet. The Targets run it at different moments and in
// different environments; converging them is separate work.
export default {
  id: 'em',
  name: 'Estado de Minas',
  matches: ['*://*.em.com.br/*'],

  userscript: {
    privilegedIdle: () => {
      window.id_acesso_noticia = 0;

      const style = document.createElement('style');
      style.type = 'text/css';

      const css = `
        .news-blocked {
          display: none !important
        }
        .news-blocked-no-scroll {
          overflow: auto !important;
          width: auto !important;
          position: unset !important;
        }

        div[itemprop="articleBody"] {
          height: auto !important;
        }
      `;

      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    },
  },

  firefox: {
    // style and css were implicit globals in the page; they still are.
    siteStart: () => {
      window.id_acesso_noticia = 0;

      window.style = document.createElement('style');
      window.style.type = 'text/css';

      window.css = `
        .news-blocked {
          display: none !important
        }

        .news-blocked-no-scroll {
          overflow: auto !important;
          width: auto !important;
          position: unset !important;
        }

        div[itemprop="articleBody"] {
          height: auto !important;
        }
      `;

      window.style.appendChild(document.createTextNode(window.css));
      document.head.appendChild(window.style);
    },
  },
};
