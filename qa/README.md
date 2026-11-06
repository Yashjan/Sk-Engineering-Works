# QA tools and reports

Production QA for the GitHub Pages export (`/Sk-Engineering-Works` base path).
Everything here is review material: nothing in `qa/` is built, bundled or deployed.

## Reports (`qa/reports/`)

| Report | What it shows |
|---|---|
| `export-validation-01-baseline.txt`, `-04-final.txt` | All 117 exported pages: `lang`/`dir`, canonical, reciprocal hreflang, sitemap ↔ pages, robots, internal links and assets under the base path, localized-script share. Final: 0 failures. |
| `lighthouse-01-baseline-summary.txt` → `-02-after-pass1` → `-03-final` | Lighthouse 12, mobile + desktop, 7 pages. Raw JSON stays local in `lighthouse/` (git-ignored, ~11 MB per run). |
| `lighthouse/04-a11y-recheck/` (local) | Accessibility-only re-run after the last contrast fixes (Engineering, Projects, Screw Conveyor). |
| `lcp-trace-01-before.txt` → `-04-final.txt` | **Observed** mobile LCP in real Chrome (4× CPU, ~1.6 Mbps, 150 ms RTT, cold cache, median of 3–5 runs) with intro timing markers. |
| `contrast-01-before.json`, `contrast-01-sources.json` | axe colour-contrast across EN/HI/AR × mobile/desktop, and the CSS rule supplying each failing colour. |
| `contrast-02-after.json`, `contrast-03-final.json`, `contrast-04-recheck.json` | Same audit after fixes, including forced `:hover` and `:focus-visible` on every link/button. |
| `browser-checks-*.txt` | Mobile overflow at 375 px, reduced motion, `lang`/`dir` after hydration, keyboard Tab order/focus rings, language-menu keyboard behaviour, axe WCAG A/AA. |
| `compare-f7fb5e9/` | Behaviour/visual comparison against commit `f7fb5e9` (GSAP, ScrollTrigger, Lenis, transitions, video, 3D, galleries) — see its README. |
| `contrast-05-final.json`, `contrast-06-stepper-recheck.json`, `browser-checks-05-final.txt`, `lcp-trace-05-final.txt`, `export-validation-05-final.txt` | Final validation after the approved fixes. |
| `contrast-07-final.json`, `export-validation-06-final.txt` | Re-check after the last cleanup (Hindi play labels, stepper dividers). |
| `video-labels-final.txt`, `export-validation-07-final.txt` | Every video play/pause/sound control on Home, Machinery and four project pages: accessible name (Chrome accessibility tree) and visible text before and after a click, in EN/HI/AR. Final: no untranslated names. |
| `image-quality-webp.txt` | PSNR and worst 8×8-block error for every PNG/JPEG → WebP conversion against the original in git history. |

### Known, intentional remaining items
- **Decorative watermarks**: `.about-page-regions` (ghost "RAJASTHAN / GUJARAT") and `.project-note-number` are `aria-hidden` decoration. WCAG 1.4.3 exempts pure decoration; axe still reports them.
- **Arabic layout direction**: `body` computes `direction: ltr` by design (see the comment in `src/app/globals.css`); all text elements are RTL. `browser_checks` reports this as `dir after hydration … body=ltr`.
- **Reload scroll restoration**: neither this build nor `f7fb5e9` restores the saved scroll position on reload (pre-existing; see `compare-f7fb5e9/README.md`).
- **Scroll-scrubbed gallery entrance** (`ProjectsVisualGallery`, mobile): captions of cards that have not scrolled in yet are mid-fade; the settled state is 6.67:1.
- **Screw Conveyor 3D page**: ~110 s Total Blocking Time in headless Chrome comes from software (SwiftShader) WebGL; it needs real-GPU device testing.

## Tools (`qa/tools/`)

The tools use Lighthouse, puppeteer-core and axe-core from a separate folder, so the project gains no dependencies:

```bash
mkdir -p ~/qa-deps && cd ~/qa-deps && npm init -y && npm i lighthouse@12 axe-core   # puppeteer-core comes with lighthouse
export QA_NODE_MODULES=~/qa-deps/node_modules
cd <repo> && npm run build                                   # produces out/
node qa/tools/serve.mjs out 4300 &                           # GitHub Pages emulator (base path, gzip, Range)
python3 qa/tools/validate_out.py out                         # export / SEO / link validation
qa/tools/run_lighthouse.sh out <label> 4301                  # then: python3 qa/tools/summarize.py qa/reports/lighthouse/<label>
node qa/tools/lcp_trace.mjs http://localhost:4300/Sk-Engineering-Works 5 / /about/
node qa/tools/contrast_audit.mjs http://localhost:4300/Sk-Engineering-Works out.json   # QA_PAGES="engineering/,…" to limit
node qa/tools/browser_checks.mjs http://localhost:4300/Sk-Engineering-Works
node qa/tools/video_labels_probe.mjs $QA_NODE_MODULES http://localhost:4300/Sk-Engineering-Works   # video control labels, EN/HI/AR
node qa/tools/i18n_noncontent_audit.mjs                      # lists code-only dictionary keys (add --apply to remove)
# Build comparison against another commit: export it with `git archive <sha> | tar -x -C <dir>`, build, serve both, then
node qa/tools/compare_build.mjs $QA_NODE_MODULES http://localhost:<port>/Sk-Engineering-Works base <outdir>   # and again with label current
node qa/tools/compare_analyze.mjs <outdir>
node qa/tools/video_scenarios.mjs $QA_NODE_MODULES <base origin> <current origin>
```

`contrast_sources.mjs` + `contrast_fix_plan.py` map each failing element to its source CSS rule and compute the minimal hue-preserving colour or alpha that reaches 4.6:1 against the worst real background.
