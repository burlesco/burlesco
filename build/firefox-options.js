// The Firefox options page's script. These are real functions, copied into
// options.js with toString(). Each one may call only the others.
//
// Choices are stored as today's extension stores them:
//   browser.storage.local  { sites: { <Site id>: boolean } }
// A Site with no stored choice is on.

export function switches() {
  return [...document.querySelectorAll('input[type=checkbox]')];
}

export function restoreOptions() {
  return browser.storage.local.get('sites').then(({ sites = {} }) => {
    for (const box of switches()) box.checked = sites[box.id] !== false;
  });
}

export function saveOptions(event) {
  event.preventDefault();
  const sites = {};
  for (const box of switches()) sites[box.id] = box.checked;
  return browser.storage.local.set({ sites })
    .then(() => browser.runtime.sendMessage('update'));
}

export function setAll(checked) {
  for (const box of switches()) box.checked = checked;
}

export function startOptions() {
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('all').addEventListener('click', () => setAll(true));
  document.getElementById('none').addEventListener('click', () => setAll(false));
}
