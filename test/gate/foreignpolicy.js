// What each Target does for Foreign Policy today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @match foreignpolicy.com
//   - DOMContentLoaded, /foreignpolicy\.com/ host check, injected <script>:
//     remove #paywall_bg, drop overlay-no-scroll from body and html, and set
//     body overflow to visible.
// firefox: not supported.
export default {
  id: 'foreignpolicy',
  userscript: {
    siteIdle: [[
      "document.getElementById('paywall_bg').remove()",
      "document.body.classList.remove('overlay-no-scroll')",
      "document.body.style.overflow = 'visible'",
      "document.documentElement.classList.remove('overlay-no-scroll')",
    ]],
  },
};
