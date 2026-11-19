# PROTOTYPE: rule-file format (#372). Throwaway.

**Question:** what should a site's rule file look like, given that one source
has to build the userscript and the Firefox extension (and Chromium MV3 later)?

The same six sites (Folha, Veja, Exame, JOTA, Diário Popular, GaúchaZH) are
written in four formats. All four compile to one IR (`core/ir.mjs`), and
shared emitters (`core/emit.mjs`) turn that IR into each target. The sites
were picked to cover every kind of technique and every awkward case: a
different technique per target, shared code, header injection, cookies, and a
large block of code.

| Variant | Shape |
|---|---|
| `a-strings` | object with fixed slots; page code as **strings** (today's style) |
| `b-functions` | same slots; page code as **functions**, serialized with `toString()` |
| `c-folders` | folder per site: `site.js` data + `<slot>[.<target>].js` script files |
| `d-techniques` | ordered list of **techniques** built with helpers; `only(target, …)` |
| `e-by-target` | B grouped by target: shared slots on top, `userscript: {…}` / `firefox: {…}` sections add to them |

## Run

```
npm install
npm run proto
```

It prints a comparison table, then writes `dist/<variant>/` with
`userscript/`, `firefox/`, `ubo/` and `COMPATIBILITY.md`.

## What to look at

- Open `variants/*/sites/folha.js` (C: `sites/folha/`) side by side in your editor.
- `gauchazh` has a real bug that ships in both repos today:
  `appendChild(script)` where it should be `style`. Lint catches it in B, C and D.
  In A it is invisible, because the code is a string.
- The closure trap in B and D: in `b-functions/sites/jota.js`, replace the
  repeated UA string with `GOOGLEBOT` and rerun. Source lint passes, because
  the variable exists in the module. Output lint reports `GOOGLEBOT is not
  defined`, because the page never sees module variables.
- Compare `dist/a-strings/userscript/burlesco.user.js` with the B one. A
  injects JSON-escaped strings; B and D keep the code as readable JS.
- `dist/d-techniques/ubo/burlesco-ubo.txt`: D's declarative `removeElements`
  becomes a uBlock cosmetic filter (`jota.info##.jota-paywall`). Code never can.
