// Opens the generated Firefox options page against a fake DOM and a fake
// browser.storage, so tests see the switches a person sees and what saving
// stores, rather than how the page is written.
import vm from 'node:vm';

const tick = () => new Promise(resolve => setImmediate(resolve));

// stored: what browser.storage.local holds before the page opens.
export async function openOptions(files, stored = {}) {
  const manifest = JSON.parse(files['dist/firefox/manifest.json']);
  const html = files[`dist/firefox/${manifest.options_ui.page}`];

  // Each checkbox, with the text of the <label for> that names it.
  const labels = Object.fromEntries([...html.matchAll(/<label for="([^"]+)">([^<]*)<\/label>/g)]
    .map(([, id, text]) => [id, unescape(text)]));
  const switches = [...html.matchAll(/<input type="checkbox" id="([^"]+)"/g)]
    .map(([, id]) => ({ id, name: labels[id], checked: false }));
  const buttons = {};
  for (const [, id] of html.matchAll(/<button[^>]* id="([^"]+)"/g)) buttons[id] = [];

  const storage = structuredClone(stored);
  const messages = [];
  const browser = {
    storage: {
      local: {
        get: async key => (key in storage ? { [key]: structuredClone(storage[key]) } : {}),
        set: async items => { Object.assign(storage, structuredClone(items)); },
      },
    },
    runtime: { sendMessage: async message => { messages.push(message); } },
  };
  const document = {
    querySelectorAll: selector => {
      if (selector !== 'input[type=checkbox]') throw new Error(`unexpected ${selector}`);
      return switches;
    },
    getElementById: id => ({
      addEventListener: (type, fn) => buttons[id].push(fn),
    }),
    addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') loaded.push(fn); },
  };
  const loaded = [];

  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
    .map(([, src]) => files[`dist/firefox/${src}`]);
  const context = vm.createContext({ browser, document, console });
  for (const script of scripts) vm.runInContext(script, context);
  for (const fn of loaded) fn();
  await tick();

  return {
    // [{ id, name, checked }] in page order.
    switches: () => switches.map(s => ({ ...s })),
    set: (id, checked) => { switches.find(s => s.id === id).checked = checked; },
    click: async id => {
      for (const fn of buttons[id]) fn({ preventDefault() {} });
      await tick();
    },
    buttons: () => Object.keys(buttons),
    storage,
    messages,
  };
}

const unescape = text => text
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
