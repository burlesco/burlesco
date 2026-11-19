// The Firefox generator: a Manifest V2 extension in dist/firefox/.
import { techniquesFor } from './techniques.js';

export const FIREFOX_DIR = 'dist/firefox';

const NETWORK = ['blockRequests', 'blockCookies', 'setRequestHeader'];

export function firefox(rules, { version }) {
  const sites = rules.map(rule => ({ rule, techniques: techniquesFor(rule, 'firefox') }));
  const files = {
    'manifest.json': JSON.stringify(manifest(sites, version), null, 2) + '\n',
  };
  return Object.fromEntries(
    Object.entries(files).map(([name, text]) => [`${FIREFOX_DIR}/${name}`, text]));
}

function manifest(sites, version) {
  return {
    manifest_version: 2,
    name: 'burlesco',
    version,
    description: 'Leia notícias sem ser assinante, burle o paywall',
    homepage_url: 'https://burles.co',
    author: 'rodorgas',
    background: { scripts: ['background.js'] },
    permissions: ['webRequest', 'webRequestBlocking', ...hostPermissions(sites)],
    browser_specific_settings: {
      gecko: {
        id: 'burlesco@burles.co',
        update_url: 'https://burlesco.github.io/burlesco-update/firefox.json',
      },
    },
  };
}

// Every URL a network Technique acts on. Exceptions sit inside those URLs.
function hostPermissions(sites) {
  const urls = sites.flatMap(({ techniques: t }) =>
    NETWORK.flatMap(key => t[key].flatMap(entry => entry.urls)));
  return [...new Set(urls)].sort();
}
