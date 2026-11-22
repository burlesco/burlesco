# Paywall testing

How to check whether Burlesco's Rules still work on live Sites, and what the planned compatibility runner must do. Everything here comes from a manual survey of 15 Sites on both Targets (November 2026). Each rule below exists because something failed without it.

## Method

- **Compare the same URL across modes.** Open each article three ways: no Burlesco, the Firefox extension, and the userscript in Tampermonkey. A Rule works when the run without Burlesco shows a wall and the Target's run, on the same URL, shows no wall and clearly more article text. A single reading on its own proves nothing.
- **Use one fresh profile per run (mode × Site × kind) and open its articles in order.** A meter then fills up the way it would for a reader, so the first walled article shows how many are free. Use separate profiles for news and opinion: Sites often allow fewer free opinion articles than news (one Site allowed one free news article and no opinion articles).
- **Wait about 7 s after load.** Paywall vendors draw the wall with JS after load. A shorter wait reads a walled page as open.
- **Take a screenshot a third of the way down the page.** That position shows either the article text or the wall. Screenshots are the ground truth: the heuristics below gave wrong verdicts on about a third of the Sites until they were checked against screenshots.

## Signals

| Signal | Use it for | How it misleads |
| --- | --- | --- |
| Visible paragraph word count | **The best bypass signal**, compared across modes for the same URL | Reads 0 when a Site's text isn't inside `<article>`/`<main>` paragraphs. Each Site needs its own article selector. |
| Vendor or Site wall selector (Piano `#offer_*`, Netdeal `._netdealPaywallBlockInnerContent`, `.modal-paywall`, `#paywall-content`) | Reliable when the selector is specific | Some wall containers stay in the page after a bypass, e.g. a wrapper around the article itself |
| Generic selectors (`[class*=assine]`, `[class*=wall]`) | Finding candidate selectors on a new Site | Match "Assine" buttons in the nav and wrappers around the whole page |
| Full-screen fixed overlay with subscribe words | Full-screen offers | Sticky headers with a subscribe link match on most Sites |
| Body scroll lock | A hint, alongside other signals | Cookie and consent dialogs lock scrolling too |
| Meter text ("você atingiu o limite…") | Rare confirmation | **Meters are invisible until they are used up.** No Site in the survey showed a running "N leituras restantes" counter. Don't wait for text. |
| Title equals the domain, near-empty body, no links | A **bot wall** | If it isn't treated as its own verdict, it reads as "open, 0 words" |
| Final host differs from the requested one | **A stale Rule:** the Site moved and the Rule's `matches` never fire | Lost if link collection filters by the original host, so keep every link |

## Confounders

- **Meters are shared by IP.** Collecting article links from the same IP used up a Site's free articles before the first real run, so a fresh profile was walled from its first article. Collect links from another IP or well before the runs, and record the egress IP with each run.
- **Consent dialogs cover the paywall.** Accept consent before measuring, or report the verdict as `consent_blocked`.
- **Bot detection blocks automated browsers outright.** Report those Sites as `bot_blocked`, i.e. untested. The runner identifies as automated and doesn't try to evade detection.
- **The first page of a fresh profile can behave differently,** for example a Technique that races the wall on first load. Report article #1 separately.
- **Some walls aren't metered.** Per-article premium content is walled whatever the order, so compare per URL, not "walled from #N".

## Browser setup

- **Firefox extension:** `driver.install_addon("dist/firefox", temporary=True)` works with the unpacked build folder.
- **Userscript:** install Tampermonkey for Firefox from AMO with `install_addon`, then serve `dist/burlesco.user.js` over HTTP (`python3 -m http.server -d dist`) and open it.
  - **The load hangs** because Tampermonkey takes it over. Use a short page-load timeout and catch the error.
  - **Click the install button yourself.** Find the tab whose URL contains `ask.html` and click the button labelled Install. The label is localised, e.g. "Instalar".
  - **`ask.html` is a privileged page.** Selenium refuses to work there unless geckodriver starts with `--allow-system-access` (`Service(service_args=['--allow-system-access'])`). The Firefox argument `-remote-allow-system-access` is rejected.
  - **Check the install on every run.** A failed install looks exactly like "the Rule does nothing", so treat it as an `error`.
- **Test the userscript on Firefox only.** Tampermonkey on Chromium (Manifest V3) ignores `@webRequest` (see COMPATIBILITY.md), so a Chromium run would report every `blockRequests` Rule as broken.
- Use `page_load_strategy='eager'` with a timeout of about 35 s, because ads keep some pages from ever firing `load`. Close extra tabs after each article.

## Soft navigation (PWA/SPA Sites)

On a Site that is a PWA, moving between articles inside the app brought the wall back, and a refresh removed it. A test that opens each URL as a fresh document never sees this, but readers hit it all the time and report Burlesco as broken.

**Cause.** The cause is when each Technique runs:

- **Page-code Techniques** (`siteStart`, `siteIdle`, `privilegedStart`, `privilegedIdle`) run once, when a document loads. A soft navigation (`pushState`, with the next article fetched by the app) loads no new document, so they don't run again, while the paywall vendor re-evaluates on the route change.
- **Network Techniques** (`blockRequests`) apply to every request, so they keep working across soft navigations, if the vendor's script or API call is among the blocked requests.
- **At-risk Sites** = SPA navigation **and** a Rule that depends on page-code Techniques. This can be predicted from COMPATIBILITY.md without running a test.

**Two test kinds:**

1. **Entry test:** a list of URLs, each opened with a fresh load. It covers **fresh loads only**.
2. **Journey test:** start at a section page and click through K articles inside the app. Link collection happens inside the run, and that's fine.
   - **Next link:** take the first unvisited link that matches the Site's article pattern. The rule is fixed, so the same page gives the same path.
   - **Click:** use a real `element.click()`, not `driver.get`, so the app's router handles the navigation.
   - **Hard or soft:** before each click set `window.__probe = 1`. If it is still there after the URL changes, the step was soft. Record the step type with every result.
   - **Path log:** record the path taken. A failing path becomes a regression case, replayed by clicking the same links while they still exist.

**Scheduling.** A one-click **navigation check** classifies each Site as `hard` or `soft`. Run journeys often on soft Sites whose Rules depend on page code, rarely elsewhere. Repeat the check from time to time, because Sites move to SPAs without notice.

**Reading a failure.** "Works on the hard step, walled on a later soft step" points to one of two fixes:

- re-run the Rule's page code on route changes (hook `pushState`/`popstate`, or a `MutationObserver` that removes the wall when it comes back);
- or move the Site to `blockRequests`, by blocking what the vendor fetches on the route change.

## Compatibility runner requirements

The runner is a scheduled, deterministic job that needs no LLM.

- **Per-Site config:** article selector, wall selectors, consent action, section pages, article URL pattern. Generic detection is for discovery only.
- **Verdict per URL × Target × entry type:** `open | walled | bypassed | not_bypassed | consent_blocked | bot_blocked | moved | error`. Store the raw numbers (words, which markers matched) next to the label.
- **Every verdict states its coverage:** Target, entry type (`fresh` or `soft`) and date. A Site counts as working only for the combinations that were tested.
- **Alert on change, not on state:** flag `bypassed → not_bypassed`, a new final host, new wall markers, or a new paywall vendor script.
- **Log enough to investigate without re-running:**
  - requested and final URL, with the redirect chain;
  - every network request URL, with whether Burlesco blocked it (new vendor hosts show up here first);
  - cookie and storage keys, and console errors;
  - which Rules and Techniques matched;
  - Burlesco, Tampermonkey and Firefox versions;
  - egress IP and timestamp;
  - a screenshot and the page HTML (both private; see Publishing).
- **Keep article lists fresh:** collect them daily, from a different IP than the runs.
- **Run politely:** infrequent runs and a few articles per Site, from the maintainer's own machine or server, not CI.

## Publishing

The runner's code and per-Site config are public. Its outputs aren't.

- **Never commit or publish run outputs.** Screenshots and page HTML contain the article text, and publishing them is republishing the publisher's work. Keep them local, git-ignored, and deleted after a fixed period.
- **Publish results only as a works/broken table per Site and Target,** the way COMPATIBILITY.md lists Techniques. Per-publisher bypass reports don't belong in the repo.
- **Respect removal requests:** when a publisher asks for a Site to be removed, delete its Rule *and* its runner config. Never test a Site that has asked to be removed.
