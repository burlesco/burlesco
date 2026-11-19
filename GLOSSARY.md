# Burlesco

Burlesco lets people read news sites without a subscription by getting past their paywalls. One set of Rules produces every Target.

## Language

**Site**:
A publication whose paywall Burlesco gets past, reachable on one or more domains. It is the unit people turn on or off.
_Avoid_: domain, host

**Rule**:
The complete description of how Burlesco gets past one Site's paywall: where it applies and which Techniques run on each Target.
_Avoid_: config, profile, spec

**Technique**:
One way of getting past a paywall, such as blocking a script, stripping cookies, changing a request header or running code on the page.
_Avoid_: strategy, method, bypass

**Target**:
A product built from the Rules for people to install: today the userscript and the Firefox extension.
_Avoid_: platform

**Site environment**:
Where code runs alongside the Site's own scripts, so it can see and replace what they use (for example `window.fetch`), but with no powers beyond the Site's.
_Avoid_: page world, main world

**Privileged environment**:
Where userscript and extension code runs: it sees the Site's page but not the Site's scripts, and has powers the Site lacks, such as cross-origin requests.
_Avoid_: isolated world, sandbox, browser environment, extension environment
