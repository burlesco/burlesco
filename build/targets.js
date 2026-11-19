// The Technique keys a Rule may use, and which Targets can carry each out.

export const TARGETS = ['userscript', 'firefox'];

// Page code: where and when it runs. Start means before the Site's own
// scripts run; idle means after the page has loaded.
export const PAGE_CODE = {
  siteStart: { environment: 'site', moment: 'start' },
  siteIdle: { environment: 'site', moment: 'idle' },
  privilegedStart: { environment: 'privileged', moment: 'start' },
  privilegedIdle: { environment: 'privileged', moment: 'idle' },
};

export const TECHNIQUES = [
  'blockRequests',
  'blockCookies',
  'setRequestHeader',
  'removeElements',
  'clearCookies',
  'connect',
  ...Object.keys(PAGE_CODE),
];

export const SUPPORTS = {
  userscript: new Set([
    'blockRequests', 'removeElements', 'clearCookies', 'connect',
    ...Object.keys(PAGE_CODE),
  ]),
  firefox: new Set([
    'blockRequests', 'blockCookies', 'setRequestHeader',
    'removeElements', 'clearCookies',
    ...Object.keys(PAGE_CODE),
  ]),
};

// Request types a blockRequests entry may name (webRequest ResourceType).
export const REQUEST_TYPES = new Set([
  'main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font',
  'object', 'xmlhttprequest', 'ping', 'media', 'websocket', 'other',
]);

export const DEFAULT_REQUEST_TYPES = ['script', 'xmlhttprequest'];
