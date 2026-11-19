// Wired. Userscript only.
export default {
  id: 'wired',
  name: 'Wired',
  matches: ['*://*.wired.com/*'],

  userscript: {
    siteIdle: () => {
      window.onload = function () {
        const style = document.createElement('style');
        style.type = 'text/css';
        const css = '.paywall-container-component {display: none !important}';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
      };
      document.cookie = '';
      localStorage.clear();
      sessionStorage.clear();
    },
    clearCookies: true,
  },
};
