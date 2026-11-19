// Foreign Policy. Userscript only.
export default {
  id: 'foreignpolicy',
  name: 'Foreign Policy',
  matches: ['*://foreignpolicy.com/*'],

  userscript: {
    siteIdle: () => {
      document.getElementById('paywall_bg').remove();
      document.body.classList.remove('overlay-no-scroll');
      document.body.style.overflow = 'visible';
      document.documentElement.classList.remove('overlay-no-scroll');
    },
  },
};
