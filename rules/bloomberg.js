// Bloomberg. Userscript only.
export default {
  id: 'bloomberg',
  name: 'Bloomberg',
  matches: ['*://www.bloomberg.com/*'],

  userscript: {
    privilegedIdle: () => {
      localStorage.clear();
      sessionStorage.clear();
    },
  },
};
