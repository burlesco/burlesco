// Forbes. Userscript only.
export default {
  id: 'forbes',
  name: 'Forbes',
  matches: ['*://*.forbes.com/*'],

  userscript: {
    privilegedIdle: () => {
      setInterval(() => {
        document.querySelector('.zephr-modal-open')?.classList.remove('zephr-modal-open');
        document.querySelector('.zephr-backdrop')?.remove();
        document.querySelector('.zephr-generic-modal')?.remove();
      }, 2000);
    },
  },
};
