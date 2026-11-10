# Screw Conveyor page: initial content and implementation audit

Date: 2026-11-10
Baseline: `3048bb1`

## What is already working

- The route uses one established React Three Fiber experience with the approved Screw Conveyor GLB.
- GSAP, ScrollTrigger, Lenis, the component inspection, the working demonstration, configuration controls and mobile inspection are already integrated.
- The machine has dedicated project media in `public/images/projects/equipment/screw-conveyor/` and a matching catalogue image.
- The site already has build-time Hindi and Arabic machinery localization, localized routes, canonical/hreflang metadata and reusable Product/Breadcrumb structured-data helpers.

## Gaps found before implementation

1. `src/data/machinery-details/screw-conveyor.ts` contains only generic one-line copy, empty component/working/configuration arrays and generic metadata.
2. The full-page experience bypasses the localized machine record in its closing sections. `ScrewConveyorClosing` imports the English record directly, so Hindi and Arabic process, engineering and enquiry copy cannot reach the page.
3. Existing interactive copy explains the machine only at a high level and includes an unverified `MS / SS construction available` statement.
4. No Product structured data is enabled for this route.
5. The process integration does not expose the existing localized links to related process machinery.
6. The current fabrication gallery is a general workshop/site montage. It includes media that is not identified in repository data as Screw Conveyor-specific. The existing media and gallery are therefore preserved, but they will not be cited as machine-specific proof in the new technical copy.
7. No Screw Conveyor engineering verification checklist exists. Dimensions, capacities, screw pitch, speed, motor power, inclination, materials, finishes and standards must remain unpublished until confirmed.

## Implementation boundary

- Preserve all 3D objects, transforms, camera movement, timelines, pinning, scroll distances, video behavior, styling and page structure.
- Route the existing localized machine record into the existing closing blocks.
- Improve content in the existing overview, component, working, configuration, plant-integration, engineering and enquiry locations.
- Add conservative metadata and Product/Breadcrumb structured data without offers, ratings or unverified specifications.
- Add no new visual section, asset, dependency or runtime translation system.
