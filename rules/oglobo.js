// O Globo. Época and Casa e Jardim have Rules of their own.
import { noPaywall } from './shared/globo.js';

export default {
  id: 'oglobo',
  name: 'O Globo',
  matches: [
    '*://*.oglobo.globo.com/*',
    // A script host, kept from the userscript's @match lines.
    '*://ogjs.infoglobo.com.br/*',
  ],

  userscript: {
    blockRequests: [{
      urls: [
        '*://ogjs.infoglobo.com.br/*/js/controla-acesso-aux.js',
        '*://static.infoglobo.com.br/paywall/register-piano/*/scripts/nova-tela-register.js',
        '*://static.infoglobo.com.br/paywall/js/tiny.js',
      ],
    }],
    // No code uses these any more; they keep the header as it was.
    connect: ['static.infoglobo.com.br', 'cdn.tinypass.com'],
  },
  firefox: { siteStart: noPaywall },
};
