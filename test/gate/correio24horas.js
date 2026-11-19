// What each Target does for Correio24horas today, before the migration.
//
// userscript: burlesco/userscript src/burlesco.user.js (v14.2)
//   - @webRequestItem correio-static.cworks.cloud .../paywall.js* (:77)
//   - DOMContentLoaded, /correio24horas\.com\.br/ (:296-307), injected
//     <script>: jQuery cleanup with [class^=blocked], plus a 1 s interval
//     forcing [itemprop^=articleBody] to height 100%
// firefox: burlesco/burlesco src/ (v14.0)
//   - background.js BLOCKLIST.correio24horas: scriptBlocking of paywall.js*
//   - content.js INJECTION.correio24horas (document_idle, injected
//     <script>): the same cleanup but with [class$=blocked], and no interval
export default {
  id: 'correio24horas',
  userscript: {
    blockRequests: [{
      urls: ['*://correio-static.cworks.cloud/vendor/bower_components/paywall.js/paywall.js*'],
    }],
    siteIdle: [[
      "jQuery('[class^=paywall]').remove()",
      "jQuery('[class^=blocked]').removeClass()",
      ".removeClass('hide').removeClass('is-active')",
      "attr('style', 'height:auto;')",
      "jQuery('[id^=paywall]').remove()",
      "jQuery('[itemprop^=articleBody]').css('height', '100%')",
      '1000',
    ]],
  },
  firefox: {
    blockRequests: [{
      urls: ['*://correio-static.cworks.cloud/vendor/bower_components/paywall.js/paywall.js*'],
      types: ['script'],
    }],
    siteIdle: [[
      "jQuery('[class^=paywall]').remove()",
      "jQuery('[class$=blocked]').removeClass()",
      ".removeClass('hide').removeClass('is-active')",
      "attr('style', 'height:auto;')",
      "jQuery('[id^=paywall]').remove()",
    ]],
  },
};
