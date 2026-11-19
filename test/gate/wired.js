// What each Target does for Wired today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match *.wired.com
//   - DOMContentLoaded, /wired\.com/ host check:
//     - privileged: eraseAllCookies() (now the clearCookies Technique);
//     - injected <script>: on window.onload, add a <style> hiding
//       .paywall-container-component; then document.cookie = "" and clear
//       local and session storage.
//   - Today the cookies are erased before the <script> is injected; now the
//     injected code runs first. Both only clear cookies and storage, so the
//     order makes no difference. The <style>'s style and css variables were
//     implicit globals; they are now local.
// firefox: not supported.
export default {
  id: 'wired',
  userscript: {
    siteIdle: [[
      'window.onload',
      '.paywall-container-component {display: none !important}',
      'document.head.appendChild(style)',
      "document.cookie = ''",
      'localStorage.clear()',
      'sessionStorage.clear()',
    ]],
    clearCookies: true,
  },
};
