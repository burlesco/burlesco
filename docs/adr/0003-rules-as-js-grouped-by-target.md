# Rules are JS objects grouped by Target, with page code as functions

Issue #372 proposed YAML. Instead, each Site's Rule is a JS module that exports plain data. Top-level keys apply to every Target, and `userscript: {…}` or `firefox: {…}` sections add Techniques for one Target. Page code is written as real functions, which the build serializes with `toString()`, so it gets lint and syntax highlighting. The prototype found a bug that ships in both repos today: GaúchaZH calls `appendChild(script)` where it should be `style`. String code had hidden it.

## Consequences

- Page code must be self-contained, since a serialized function can't see module variables. The build lints its own output with `no-undef` to catch this.
- The build rejects unknown keys, so a typo fails instead of being ignored.
- Target sections only add to the top level, never replace it.

## Considered Options

The prototype on branch `prototype/rule-format` compared five formats on six real Sites:

- code as strings
- the same slots with code as functions, keyed by Target inside each slot
- a folder per Site
- a list of helper-built Techniques (`only(target, …)`)
- this one

The list of Techniques holds exactly the same information. It is the fallback if fixed keys start to feel limiting.
