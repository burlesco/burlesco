// Runs a generated Firefox background script against a fake webRequest API,
// so tests observe what happens to requests rather than how the script is
// written. Filters are matched the way Firefox does: by URL pattern and
// request type.
import vm from 'node:vm';
import { matchPatternToRegExp } from '../../build/match-pattern.js';

export function runBackground(script) {
  const events = {};
  const event = name => {
    const listeners = (events[name] = []);
    return {
      addListener: (fn, filter, extra) => listeners.push({ fn, filter, extra }),
      removeListener: fn => {
        const i = listeners.findIndex(l => l.fn === fn);
        if (i >= 0) listeners.splice(i, 1);
      },
      hasListener: fn => listeners.some(l => l.fn === fn),
    };
  };
  const browser = {
    webRequest: {
      onBeforeRequest: event('onBeforeRequest'),
      onBeforeSendHeaders: event('onBeforeSendHeaders'),
      onHeadersReceived: event('onHeadersReceived'),
    },
  };
  const context = vm.createContext({ browser, chrome: browser, console });
  vm.runInContext(script, context);

  const applies = (filter, details) =>
    (!filter.types || filter.types.includes(details.type)) &&
    filter.urls.some(u => matchPatternToRegExp(u).test(details.url));

  // Feeds details through every listener of one event, in order, carrying
  // header changes forward. Returns the combined result.
  const fire = (name, details, headersKey) => {
    let current = { ...details };
    let cancel = false;
    for (const { fn, filter } of events[name]) {
      if (!applies(filter, current)) continue;
      const result = fn(current) ?? {};
      if (result.cancel) cancel = true;
      if (headersKey && result[headersKey]) {
        current = { ...current, [headersKey]: result[headersKey] };
      }
    }
    return { cancel, headers: headersKey ? current[headersKey] : undefined };
  };

  return {
    context,
    // Data the script holds, read straight from its global scope.
    read: name => vm.runInContext(name, context),
    // Would Firefox let this request go out?
    blocked: (url, type = 'script') =>
      fire('onBeforeRequest', { url, type }).cancel,
    // The request headers Firefox would send, as { name: value }.
    sentHeaders: (url, type, headers) => toObject(fire('onBeforeSendHeaders',
      { url, type, requestHeaders: toList(headers) }, 'requestHeaders').headers),
    // The response headers the page would see, as [name, value] pairs.
    receivedHeaders: (url, type, headers) => fire('onHeadersReceived',
      { url, type, responseHeaders: headers.map(([name, value]) => ({ name, value })) },
      'responseHeaders').headers.map(h => [h.name, h.value]),
    listenerCount: () => Object.values(events).reduce((n, l) => n + l.length, 0),
  };
}

const toList = headers => Object.entries(headers).map(([name, value]) => ({ name, value }));
const toObject = list => Object.fromEntries(list.map(h => [h.name, h.value]));
