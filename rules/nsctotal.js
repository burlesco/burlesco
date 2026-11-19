// NSC Total (tinypass).
import { blockTinypass } from './shared/tinypass.js';

export default {
  id: 'nsctotal',
  name: 'NSC Total',
  matches: [
    '*://*.nsctotal.com.br/*',
    // tinypass's own hosts, kept from the userscript's @match lines. The
    // Rule has no page code, so nothing runs there.
    '*://api.tinypass.com/*',
    '*://cdn.tinypass.com/*',
    '*://dashboard.tinypass.com/*',
  ],

  userscript: {
    blockRequests: [{
      urls: [
        'https://paywall.nsctotal.com.br/behaviors',
        // Older tinypass scripts no Site claims; userscript blocks apply
        // everywhere, so this tinypass Site carries them.
        '*://dashboard.tinypass.com/xbuilder/experience/load*',
        '*://cdn.tinypass.com/api/tinypass.min.js',
      ],
    }],
  },
  firefox: {
    blockRequests: [
      { urls: ['https://paywall.nsctotal.com.br/behaviors'], types: ['xmlhttprequest'] },
      blockTinypass,
    ],
  },
};
