// Nexo. Extension only: the userscript doesn't support it today.
export default {
  id: 'nexo',
  name: 'Nexo',
  matches: ['*://*.nexojornal.com.br/*'],

  firefox: {
    blockRequests: [
      {
        urls: ['https://acesso.nexojornal.com.br/paywall/*'],
        types: ['xmlhttprequest'],
      },
    ],

    // Hide the paywall before it shows. The old code set `style` as an
    // implicit global; window.style keeps that.
    siteStart: () => {
      const style = window.style = document.createElement('style');
      style.type = 'text/css';

      const css = `
        body {
          overflow: auto !important;
        }

        div[class*='PaywallBumper__wrap-container'],
        div[class*='Datawall__wrap-container'] {
          display: none !important;
        }
      `;

      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    },

    // Then remove it. The selectors lack their closing `]`, as they always
    // have; querySelector accepts them.
    siteIdle: () => {
      const selectors = [
        "div[class*='PaywallBumper__wrap-container'",
        "div[class*='Datawall__wrap-container'",
      ];

      selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.remove();
      });
    },
  },
};
