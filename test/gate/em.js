// What each Target does for Estado de Minas today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - DOMContentLoaded, privileged, /em\.com\.br/ (:404-427): sets
//     window.id_acesso_noticia = 0 (on the sandbox's window, so probably
//     not the page's), then appends a <style> hiding .news-blocked,
//     unlocking .news-blocked-no-scroll and un-capping the article height
// firefox: burlesco/burlesco src/ (v14.0)
//   - content-start.js INJECTION_START.em (document_start, injected
//     <script>): the same code, with style and css as implicit globals.
//     The Rule writes them as window.style and window.css, which is the
//     same thing in the page.
const CSS = [
  'id_acesso_noticia = 0',
  "createElement('style')",
  '.news-blocked {',
  'display: none !important',
  '.news-blocked-no-scroll {',
  'position: unset !important;',
  'div[itemprop="articleBody"] {',
  'height: auto !important;',
  'document.head.appendChild',
];

export default {
  id: 'em',
  userscript: {
    privilegedIdle: [CSS],
  },
  firefox: {
    siteStart: [[...CSS, 'window.style', 'window.css']],
  },
};
