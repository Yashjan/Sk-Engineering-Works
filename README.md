# S.K. Engineering Works

Next.js App Router foundation with TypeScript, Tailwind CSS, ESLint, and GSAP. The page contains a responsive Navbar, cinematic Hero, and three-stage process journey prototype.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run lint`, `npm run typecheck`, and `npm run build` for validation.

## Assets

- Place the real company logo at `public/images/sk-logo.png`.
- The Hero background uses `public/images/Golden Hour Salt Processing Plant.png`.

The page detects these files on the server. Until they exist, it displays a neutral logo box and an abstract industrial CSS background. Restart the development server or rebuild after adding assets. No logo is generated or approximated.

The Hero media layer in `src/components/home/Hero.tsx` can later hold a factory video. Navigation destinations and quote links temporarily use `#process` until the corresponding pages or quote flow are built.

## Process prototype

Place the transparent machinery renders at:

- `public/images/process/hopper.png`
- `public/images/process/belt-conveyor.png`
- `public/images/process/wet-mill.png`

Missing renders use abstract placement guides, not fake machinery. Restart development or rebuild after adding assets. Add future stages to `src/data/process.ts`; the rendering, stage count, timeline stops, and scroll distance derive from the array.

On desktop/tablet at least 768px wide, ScrollTrigger pins the entire 100vh section at `top top`. A viewport-wide flex track translates by -100% per stage. Each transition receives 100vh of vertical scroll, with a 20vh hold at each stage (260vh total for three stages). A 20vh bottom margin provides room to scroll past the pin's end while this remains the final section. Visuals, copy, numbers, and the engineering grid move at different speeds. Small screens and reduced motion use sequential vertical stages. Stage navigation works with a keyboard. Explore Machine opens a temporary purpose note within the stage until real machine detail pages exist.

Animations respect reduced motion. The mobile navigation supports Escape, focus containment, and scroll locking.
