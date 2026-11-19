// Forbes.pl and Newsweek.pl share one paywall. Userscript only.
export default {
  id: 'forbespl',
  name: 'Forbes.pl / Newsweek.pl',
  matches: ['*://*.forbes.pl/*', '*://*.newsweek.pl/*'],

  userscript: {
    privilegedIdle: () => {
      let contentPremium = document.querySelector('.contentPremium');
      if (contentPremium) {
        contentPremium.classList.remove('contentPremium');
      }
    },
  },
};
