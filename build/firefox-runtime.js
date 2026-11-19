// The Firefox background's engine. These are real functions, copied into
// background.js with toString(), next to the generated data they read:
//   NETWORK    { <Site id>: { blockRequests, blockCookies, setRequestHeader } }
//   LISTENERS  [] of [event, listener], so the engine can be undone
// Each one may call only the others and matchPatternToRegExp.
/* global NETWORK, LISTENERS */
import { matchPatternToRegExp } from './match-pattern.js';

// Registers every Site's network Techniques. `sites` is the options page's
// stored { <Site id>: boolean }; a Site set to false is skipped.
export function applyNetwork(sites = {}) {
  const web = browser.webRequest;
  const without = (headers, name) =>
    headers.filter(h => h.name.toLowerCase() !== name);
  for (const [id, t] of Object.entries(NETWORK)) {
    if (sites[id] === false) continue;
    for (const { urls, except, types } of t.blockRequests) {
      const allowed = except.map(matchPatternToRegExp);
      listen(web.onBeforeRequest,
        details => ({ cancel: !allowed.some(re => re.test(details.url)) }),
        { urls, types }, ['blocking']);
    }
    for (const { urls } of t.blockCookies) {
      const types = ['main_frame', 'script', 'xmlhttprequest'];
      listen(web.onBeforeSendHeaders,
        details => ({ requestHeaders: without(details.requestHeaders, 'cookie') }),
        { urls, types }, ['blocking', 'requestHeaders']);
      listen(web.onHeadersReceived,
        details => ({ responseHeaders: without(details.responseHeaders, 'set-cookie') }),
        { urls, types }, ['blocking', 'responseHeaders']);
    }
    for (const { urls, name, value } of t.setRequestHeader) {
      listen(web.onBeforeSendHeaders,
        details => ({
          requestHeaders: [
            ...without(details.requestHeaders, name.toLowerCase()),
            { name, value },
          ],
        }),
        { urls, types: ['main_frame', 'xmlhttprequest'] },
        ['blocking', 'requestHeaders']);
    }
  }
}

// Undoes applyNetwork, so it can run again with new choices.
export function removeNetwork() {
  for (const [event, listener] of LISTENERS.splice(0)) {
    event.removeListener(listener);
  }
}

export function listen(event, listener, filter, extra) {
  event.addListener(listener, filter, extra);
  LISTENERS.push([event, listener]);
}
