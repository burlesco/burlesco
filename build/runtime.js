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

// Expires every cookie the page can see, on every domain and path it may
// have been set for.
export function eraseAllCookies() {
  const host = location.hostname;
  const domains = [
    host,
    host.replace(/^www\./, ''),
    host.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2'),
  ];
  const segments = location.pathname.split('/').filter(Boolean);
  const paths = ['/', ...segments.map((_, i) => '/' + segments.slice(0, i + 1).join('/'))];
  const expired = 'expires=Thu, 01 Jan 1970 00:00:01 GMT';
  for (const pair of document.cookie.split(/;\s*/)) {
    const name = pair.split('=')[0];
    if (!name) continue;
    document.cookie = `${name}=; ${expired}`;
    for (const path of paths) {
      document.cookie = `${name}=; path=${path}; ${expired}`;
      for (const domain of new Set(domains)) {
        document.cookie = `${name}=; domain=${domain}; path=${path}; ${expired}`;
      }
    }
  }
}
