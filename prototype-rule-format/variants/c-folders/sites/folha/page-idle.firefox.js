// The paywall script is blocked; just reveal the text.
window.omtrClickUOL = function () {};
setTimeout(() => {
  $('#bt-read-more-content').next().show().prev().remove();
}, 100);
