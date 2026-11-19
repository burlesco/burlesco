// Request types (webRequest ResourceType) a blockRequests entry may name.
export const REQUEST_TYPES = new Set([
  'main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font',
  'object', 'xmlhttprequest', 'ping', 'media', 'websocket', 'other',
]);

// What a blockRequests entry blocks when it names no types.
export const DEFAULT_REQUEST_TYPES = ['script', 'xmlhttprequest'];
