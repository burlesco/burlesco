# One source in burlesco/burlesco; userscript repo archived

The Rules for every Target live in `burlesco/burlesco`, which carries the project name, issue #372 and the release tooling for `burlesco-update`. `burlesco/userscript` is archived. Existing userscript installs update from `burlesco/userscript/releases/latest/download/burlesco.user.js`, so before archiving, that repo publishes one last release whose `@updateURL` and `@downloadURL` point to the new home. Archiving without that release would leave every installed userscript stuck on its last version.
