var script = document.createElement('script');
script.src = chrome.extension.getURL('fetch.burlesco.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);
