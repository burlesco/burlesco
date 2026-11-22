// Revista Galileu (Globo). Both Targets run the same code, in different
// environments.
const cleanUp = () => {
  const cleanGalileu = () => {
    const div = document.querySelector('#detecta-adblock');
    document.querySelector('body').style.overflow = 'initial';
    div?.parentNode.removeChild(div);
  };
  cleanGalileu();
  setTimeout(cleanGalileu, 4000);
};

export default {
  id: 'galileu',
  name: 'Revista Galileu',
  matches: ['*://*.revistagalileu.globo.com/*'],

  userscript: { privilegedIdle: cleanUp },
  firefox: { siteIdle: cleanUp },
};
