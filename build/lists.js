// Small list helpers the generators share.

// The list without repeats, in first-seen order.
export const unique = list => [...new Set(list)];

// Rules in the order people look for them: by name, as Portuguese sorts it.
export const byName = rules =>
  [...rules].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
