// Correio do Povo. Userscript only.
export default {
  id: 'correiodopovo',
  name: 'Correio do Povo',
  matches: ['*://*.correiodopovo.com.br/*'],

  userscript: {
    privilegedStart: () => {
      const cleanPaywall = () => {
        const div = document.querySelector('[id^="pwm"] > div');
        const iframe = document.querySelector('[id^="pwm"] > iframe');
        document.querySelector('body').style.overflow = 'initial';
        iframe?.parentNode.removeChild(iframe);
        div?.parentNode.removeChild(div);
      };
      setTimeout(cleanPaywall, 4000);
      cleanPaywall();
    },
  },
};
