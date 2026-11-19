// Every Technique a Rule may use, described once. Each descriptor says:
//   targets  the Targets that can carry it out
//   check    how a Rule must write it (see rule-checks.js)
//   combine  how the top level and a Target's section combine: it gets the
//            values that are set, top level first, and returns the Target's
//   network  for network Techniques: the request types it acts on
//            (blockRequests: the default; an entry may name its own)
//   page     for page code: the environment it runs in, and the moment.
//            Start means before the Site's own scripts run; idle means
//            after the page has loaded.
import * as checks from './rule-checks.js';
import { DEFAULT_REQUEST_TYPES } from './request-types.js';

export { REQUEST_TYPES, DEFAULT_REQUEST_TYPES } from './request-types.js';

export const TARGETS = ['userscript', 'firefox'];

const pageCode = (environment, moment) => ({
  targets: TARGETS,
  check: checks.pageCode(environment, `privileged${moment[0].toUpperCase()}${moment.slice(1)}`),
  combine: values => values,
  page: { environment, moment },
});

export const TECHNIQUES = {
  blockRequests: {
    targets: TARGETS,
    check: checks.blockRequests,
    combine: values => values.flat().map(block => ({
      urls: [...block.urls],
      except: [...(block.except ?? [])],
      types: [...(block.types ?? DEFAULT_REQUEST_TYPES)],
    })),
    network: { types: DEFAULT_REQUEST_TYPES },
  },
  // Strips Cookie and Set-Cookie.
  blockCookies: {
    targets: ['firefox'],
    check: checks.blockCookies,
    combine: values => values.map(({ urls }) => ({ urls: [...urls] })),
    network: { types: ['main_frame', 'script', 'xmlhttprequest'] },
  },
  setRequestHeader: {
    targets: ['firefox'],
    check: checks.setRequestHeader,
    combine: values => values.flat()
      .map(({ urls, name, value }) => ({ urls: [...urls], name, value })),
    network: { types: ['main_frame', 'xmlhttprequest'] },
  },
  removeElements: {
    targets: TARGETS,
    check: checks.removeElements,
    combine: values => values.flat(),
  },
  clearCookies: {
    targets: TARGETS,
    check: checks.clearCookies,
    combine: values => values.some(Boolean),
  },
  // Hosts privileged code may reach: the userscript's @connect lines.
  connect: {
    targets: ['userscript'],
    check: checks.connect,
    combine: values => values.flat(),
  },
  siteStart: pageCode('site', 'start'),
  siteIdle: pageCode('site', 'idle'),
  privilegedStart: pageCode('privileged', 'start'),
  privilegedIdle: pageCode('privileged', 'idle'),
};

export const TECHNIQUE_KEYS = Object.keys(TECHNIQUES);

const keysWith = field => TECHNIQUE_KEYS.filter(key => TECHNIQUES[key][field]);

// Target -> the Technique keys it can carry out.
export const SUPPORTS = Object.fromEntries(TARGETS.map(target =>
  [target, new Set(TECHNIQUE_KEYS.filter(key => TECHNIQUES[key].targets.includes(target)))]));

// Page-code key -> { environment, moment }.
export const PAGE_CODE = Object.fromEntries(keysWith('page').map(key => [key, TECHNIQUES[key].page]));

// The network Techniques' keys, and the request types each acts on.
export const NETWORK = keysWith('network');
export const NETWORK_REQUEST_TYPES = Object.fromEntries(
  NETWORK.map(key => [key, TECHNIQUES[key].network.types]));
