// MIT Technology Review. Userscript only.
export default {
  id: 'technologyreview',
  name: 'MIT Technology Review',
  matches: ['*://*.technologyreview.com/*'],

  userscript: {
    privilegedIdle: () => {
      document.querySelector('#template-container').remove();
      localStorage.clear();

      // Expires a cookie with no path and with every path prefix, each with
      // no domain and with every domain it may have been set for
      // (https://stackoverflow.com/a/28081337/1840019).
      const domains = [
        document.domain,
        document.domain.replace(/^www\./, ''),
        document.domain.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2'),
      ];
      let pathStr = '';
      const cookPaths = [''].concat(location.pathname.split('/')
        .map(pathWord => '/' + pathWord)
        .map(pathNode => {
          if (pathStr) {
            pathStr += pathNode;
            return pathStr;
          }
          pathStr = '; path=';
          return pathStr + pathNode;
        }));
      const expired = '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      const eraseCookie = cookieName => cookPaths.forEach(path => {
        document.cookie = cookieName + '=' + path + expired;
        for (const domain of domains) {
          document.cookie = cookieName + '=' + path + '; domain=' + domain + expired;
        }
      });

      ['xbc', '_pcid', '_pcus', '__tbc', '__pvi', '_pctx'].forEach(eraseCookie);
    },
  },
};
