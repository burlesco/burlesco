// Crusoé lets in anyone with its subscriber cookie. The extension knew it
// as crusoe.uol.com.br and the userscript as crusoe.com.br; the Rule covers
// both on both Targets.

// Self-contained, so both sections can use it.
const setSubscriber = () => {
  document.cookie = 'crs_subscriber=1';
};

export default {
  id: 'crusoe',
  name: 'Crusoé',
  matches: ['*://crusoe.uol.com.br/*', '*://crusoe.com.br/*'],

  userscript: { privilegedStart: setSubscriber },
  firefox: { siteStart: setSubscriber },
};
