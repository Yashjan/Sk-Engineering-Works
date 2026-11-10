# Screw Washer content audit

Date: 2026-11-10
Baseline: `da44b4d18dd21b7f4b955b3ae4a8b66c6182810e`

## Current implementation

- Published routes exist at `/machinery/screw-washer/`, `/hi/machinery/screw-washer/` and `/ar/machinery/screw-washer/` through the shared static machinery-detail route.
- The page uses the approved reusable machinery-detail layout. It has no 3D model and uses the existing non-interactive digital-inspection placeholder.
- One transparent catalog render exists at `public/images/machinery/catalog/screw-washer.webp`. No repository record identifies it as verified workshop or site photography.
- `realMedia` is empty, so the page does not show machine-specific fabrication or installation evidence.
- The existing page has the standard overview, construction, working, configuration, process-integration, engineering and enquiry sections, but most copy is one sentence long.

## Issues found

1. The overview does not explain that washing arrangements vary with raw salt, water and process requirements or that a screw washer is not interchangeable with every washing system.
2. The four-step working description omits liquid contact, agitation and the conditional nature of drainage or overflow arrangements.
3. Component descriptions are too generic for engineering or procurement review and do not distinguish visible assemblies from design-dependent provisions.
4. Configuration copy omits raw-salt condition, particle size, washing objective, water, drainage, screw geometry, residence, corrosion, wear and maintenance access.
5. Process copy presents the connection to dewatering as universal instead of identifying the site's illustrated sequence as one possible arrangement.
6. The enquiry section provides no Screw Washer-specific buyer-input guidance.
7. The SEO title is broader and less specific than the approved machinery-page pattern. Product and Breadcrumb structured data are not enabled.
8. Hindi relies on short shared dictionary entries and has no complete build-time technical translation.
9. Arabic SEO translations in the shared dictionary are corrupted (`غسّر غسالة` and `واكر`). No complete build-time Arabic technical translation exists.
10. The hero alt text attributes the rendered machine to S.K. Engineering Works without a repository record proving media provenance.
11. No numerical specifications, purity improvement, recovery, efficiency, water saving or completed-project evidence is available and none should be published.

## Safe implementation direction

- Keep every existing component, section, image, interaction, animation and layout unchanged.
- Expand only the existing data fields with conditional, machine-specific technical explanations.
- Describe the catalog render neutrally and keep the existing no-photography state.
- Add server-only Hindi and Arabic content files so long copy is emitted into localized static HTML rather than shared client JavaScript.
- Enable conservative Product and Breadcrumb data without offers, price, ratings, specifications or manufacturer claims.
- Retain the Complete Salt Refinery Plants link and add only a relevant link to the already-developed Screw Conveyor page.
