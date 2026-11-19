// Gazeta do Povo: block netdeal, which runs its paywall.
export default {
  id: 'gazetadopovo',
  name: 'Gazeta do Povo',
  // netdeal isn't a Site page, but the userscript has always matched it.
  // Gazeta do Povo has no page code, so this only keeps the @match line.
  matches: ['*://*.gazetadopovo.com.br/*', '*://www.netdeal.com.br/*'],

  blockRequests: [{ urls: ['*://www.netdeal.com.br/*'], types: ['script'] }],
};
