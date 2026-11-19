// Helpers the generated scripts call. They are real functions, copied into
// the output with toString(), so they get lint here like any other code.
// Each one must be self-contained.

// Runs a function in the Site environment, by injecting it as a <script>.
export function runInSite(fn) {
  const script = document.createElement('script');
  script.textContent = '(' + fn + ')();';
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

// Runs a function once the page has loaded.
export function onIdle(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

export function removeElements(selectors) {
  document.querySelectorAll(selectors).forEach(el => el.remove());
}

// Expires every cookie the page can see. Ported verbatim from the old
// userscript (burlesco/userscript v14.2, src/burlesco.user.js:490-534), so
// paths, domains and name parsing behave as they did. eraseCookie redefines
// itself after its first call, and its path list relies on `this` being the
// global object, which holds because the generated scripts are not strict.
export function eraseAllCookies() {
  var cookieList  = document.cookie.split (/;\s*/);
  for (var J = cookieList.length - 1;   J >= 0;  --J) {
    var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, '$1');
    eraseCookie (cookieName);
  }
}

export function eraseCookie (cookieName) {
  // https://stackoverflow.com/a/28081337/1840019
  //--- ONE-TIME INITS:
  //--- Set possible domains. Omits some rare edge cases.?.
  var domain      = document.domain;
  var domain2     = document.domain.replace (/^www\./, '');
  var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, '$2');

  //--- Get possible paths for the current page:
  var pathNodes   = location.pathname.split ('/').map ( function (pathWord) {
    return '/' + pathWord;
  } );
  var cookPaths   = [''].concat (pathNodes.map ( function (pathNode) {
    if (this.pathStr) {
      this.pathStr += pathNode;
    }
    else {
      this.pathStr = '; path=';
      return (this.pathStr + pathNode);
    }
    return (this.pathStr);
  } ) );

  // eslint-disable-next-line no-func-assign
  ( eraseCookie = function (cookieName) {
    //--- For each path, attempt to delete the cookie.
    cookPaths.forEach ( function (pathStr) {
      //--- To delete a cookie, set its expiration date to a past value.
      var diagStr     = cookieName + '=' + pathStr + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      document.cookie = diagStr;

      document.cookie = cookieName + '=' + pathStr + '; domain=' + domain  + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      document.cookie = cookieName + '=' + pathStr + '; domain=' + domain2 + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      document.cookie = cookieName + '=' + pathStr + '; domain=' + domain3 + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
    } );
  } ) (cookieName);
}
