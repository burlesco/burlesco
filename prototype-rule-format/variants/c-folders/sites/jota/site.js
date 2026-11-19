export default {
  name: 'JOTA',
  matches: ['*://*.jota.info/*'],
  setRequestHeader: {
    urls: ['*://www.jota.info/*'],
    name: 'User-Agent',
    value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    targets: ['firefox'],
  },
};
