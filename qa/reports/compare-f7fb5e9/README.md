# Behaviour comparison: optimized build vs commit `f7fb5e9`

Both builds were exported and served under `/Sk-Engineering-Works`, then driven in headless Chrome. Motion was enabled and the intro was allowed to finish.

- **Pages:** 10 English pages on desktop, 5 on mobile, plus Arabic home and Hindi Machinery.
- **Snapshots:** 227 scroll positions in total.
- **Recorded at each position:** document height, ScrollTrigger pin spacers and pinned elements, Lenis state, intro state, every `<video>` (source, play state, `readyState`), the 3D canvas, JS errors, and a screenshot with `<video>` and `<canvas>` masked.
- **Probes:** Lenis wheel smoothing, the route transition, projects-showcase media switching, and 3D drag.

Tools: `qa/tools/compare_build.mjs`, `compare_analyze.mjs`, `video_scenarios.mjs`, `gallery_probe.mjs`, `stepper_probe.mjs`, `watermark_a11y_probe.mjs`.

## 01-initial — first comparison (before the approved fixes)
Two regressions caused by the optimisation were found:

1. **Deferred homepage videos sometimes stayed paused.** This happened with the projects showcase and the manufacturing film when the page jumped straight to them, in 3 of 6 jump runs. The cause was a race between the section's play-on-visible observer and the deferred `src`.
2. **Desktop gallery photos were dimmer.** This affected the Projects and Screw Conveyor pages. The photo dim had moved onto the media element and stacked with GSAP's inline card opacity.

`diff_desktop_projects__03.jpg` shows #2. `intended-contrast-changes.jpg` shows the deliberate contrast changes. `diff_desktop_about__14.jpg` is an example of marquee timing noise.

## 02-final — after the approved fixes
| Area | Result |
|---|---|
| ScrollTrigger pins, page heights, Lenis, intro state, JS errors, 3D canvas | **0 differences** across 227 snapshots |
| Lenis wheel smoothing | Same eased curve to the same end point (`analysis.txt` → PROBES) |
| Route transition | Same route change (~280 ms) |
| 3D Screw Conveyor | Renders and responds to drag in both builds |
| Projects showcase media switching | Identical: plays after scroll-in and after every tab switch |
| Deferred videos: Lenis jump, scrollbar jump, anchor link, wheel, Back navigation | **30/30 playing** (`video-scenarios.txt`) |
| Initial-load requests for deferred media | Base: poster + both videos. Final: **none** |
| Gallery photos (desktop, reduced-motion desktop, mobile) | **Identical opacities** to base (`gallery-opacity.txt`, `gallery-desktop_base-vs-final.jpg`) |
| Screenshots | 175/227 pixel-identical. The rest are intended contrast changes, marquee position, or scroll-scrub timing (each verified, see below) |

### Remaining, intended differences
- **Text contrast.** Muted labels and captions are slightly darker on light sections and lighter on dark ones. Project stage numerals go from 22% to 37%. Gallery captions on inactive desktop cards are at full strength (the photos are unchanged).
- **Salt-process stepper** (`salt-stepper-opacity.txt`, `salt-stepper_base-vs-final.jpg`). Effective opacity of the step name / number / divider line:

  | | Active | Inactive | Others while one step is hovered |
  |---|---|---|---|
  | Base | 1.00 / 0.55 / 28% | 0.44 / 0.24 / 6.2% | 0.28 / 0.15 / 3.9% |
  | Final | 1.00 / 0.82 / 28% | 0.60 / 0.60 / 6.0% | 0.60 / 0.60 / 4.0% |

  0.60 is the WCAG AA floor for the step text on `#f5ede1` (4.6:1); the active row stays clearly separated (15.9:1). The divider lines are decorative, so they keep the original values in both states (the 0.1–0.2 point gap is 8-bit alpha rounding). The one part that cannot be kept is the extra *text* dimming below the inactive level while a step is hovered, because that falls under AA. Hover, click, focus, GSAP and ScrollTrigger behaviour are unchanged; only opacity and border colour values differ.
- **Hindi video controls.** `PAUSE` reads "रोकें" instead of "लूटना" ("to loot"). `Play`/`PLAY` read "चलाएँ" instead of "खेल" ("game"), and the play labels `PLAY FILM`, `Play project video`, `Play manufacturing video` and `Play workshop film` now end in "चलाएँ" like the other play labels.
- **Mobile hero videos** use 540p versions.
- **About hero video** stays paused for visitors who prefer reduced motion.

### Noise, verified as not caused by the changes
- **Client-logo marquee.** Screenshots catch it at different points in its loop; the difference is a horizontal shift of 4–6 px.
- **Scroll-scrubbed animations.** On desktop Home (process journey) and the Screw Conveyor mobile gallery, repeated captures of the same scroll position give identical values across builds (desktop Home: 35.9 in all 6 runs).
- **Screw Conveyor navbar tint** on mobile depends on the 3D scene loading behind it. The value is 48.6 in most runs of both builds, with one outlier in each.

### Pre-existing (present in `f7fb5e9` as well)
- **Reload never restores the scroll position.** The browser restores before GSAP pins and the intro release, so the page lands well above the saved point: base at ~8.9k px, final at ~3.0k px, for a saved 30.6k px. The landing point differs because of load-event timing; the static layout is identical (verified with JS disabled).
- **Hindi pause labels other than `PAUSE`** remain poor: `Pause` "पौलुस" (the name Paul), `PAUSE FILM` "प्यास फिल्म" ("thirst film"), and transliterations in `Pause project video` / `Pause workshop film` / `Pause manufacturing video`. Left unchanged pending approval.
- **Decorative region watermark** (`.about-page-regions`). It carries `aria-hidden="true"` in the exported EN/HI/AR About pages, has no focusable content and is absent from the accessibility tree; the region names are still read from the heading, paragraph and location list. axe's colour-contrast rule still lists it because that rule checks painted text regardless of `aria-hidden`; WCAG 1.4.3 exempts pure decoration.

## 03-cleanup — after the final cleanup (Hindi play labels, stepper dividers, QA lint)
Full 227-snapshot comparison re-run against `f7fb5e9` (`03-cleanup/analysis.txt`):
- **0 structural differences:** heights, pins, Lenis, intro, JS errors and 3D canvas all match.
- **0 video play-state mismatches.** The remaining video lines are `readyState` only: off-screen homepage videos no longer preload, and mobile uses the 540p sources.
- **174/227 screenshots identical.** The others are the same intended contrast changes and timing noise as 02-final. The new small entries (≤0.36%) are text anti-aliasing (`desktop_projects__03`, where the photos are identical) or a reveal caught mid-fade (`desktop_ar__05`).
- **Same probe results:** Lenis wheel reaches the same end point; projects-showcase switching is identical and shows "रोकें".
- **Watermark** (`watermark-a11y-tree.txt`): `aria-hidden` and absent from the accessibility tree in EN/HI/AR. `contrast-07-final.json`: the only entries are this watermark.
