// What each Target does for Diarinho today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem *.diarinho.com.br/wp-admin/admin-ajax.php (:96) and
//     the redundant diarinho.com.br/wp-admin/admin-ajax.php (:97)
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.diarinho: xhrBlocking of
//     *.diarinho.com.br/wp-admin/admin-ajax.php
// Neither has page code.
export default {
  id: 'diarinho',
  userscript: {
    blockRequests: [{
      urls: [
        '*://*.diarinho.com.br/wp-admin/admin-ajax.php',
        '*://diarinho.com.br/wp-admin/admin-ajax.php',
      ],
    }],
  },
  firefox: {
    blockRequests: [{
      urls: ['*://*.diarinho.com.br/wp-admin/admin-ajax.php'],
      types: ['xmlhttprequest'],
    }],
  },
};
