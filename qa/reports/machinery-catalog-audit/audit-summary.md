# Remaining machinery catalog audit — executive summary

## Decision summary

- **Baseline:** `11431986f2fe5965d575695811208f6eb1d09fd6`, branch `main`, clean at audit start.
- **Catalog:** 21 machinery entries.
- **Status:** 5 completed/improved, 15 partial shared-template pages, 1 placeholder.
- **Completed references:** Belt Conveyor, Screw Conveyor, Screw Washer, Wet Mill and Centrifuge. Complete Salt Refinery Plants remains the central commercial reference page.
- **Recommended next pages:** 1) ID Fan / Blower, 2) Cyclone, 3) Dryer.
- **No external keyword data:** buyer/search-intent ratings are qualitative.

## Why these three

ID Fan / Blower and Cyclone combine meaningful refinery-system relevance with the strongest remaining repository media. Both can be improved conservatively once equipment identity and system details are confirmed. Dryer is more central to the complete salt-refinery offer than either, but must wait for engineering confirmation because the repository currently proves only an illustrative external render and a high-level process role.

## Highest-priority risks

1. **Chimney is a linked placeholder.** The catalog and project record send users to a three-line “coming next” route in all languages. It is correctly `noindex` and absent from the sitemap, but still a usability defect.
2. **Translation presence is misleading.** Several Hindi/Arabic strings are literal or wrong. Arabic Bag Filter and Storage Silos names are clear defects; Thickener and Vibro Screen technical sentences require native review.
3. **Generic template depth.** Fifteen pages reuse the same SEO pattern, configuration copy, engineering statement and enquiry structure. They do not contain enough machine-specific operating, installation, maintenance or selection information to be called complete.
4. **Media provenance.** Project files strongly associate videos with five remaining machines, but repository labels do not independently prove customer, construction, capacity or performance. The Cyclone installed-photo claim is especially worth confirming.
5. **Naming ambiguity.** “Process Tanks / Washing Tanks” maps to a singular settling-focused Process Tank page; “Hammer Mill / Crusher” may combine distinct mechanisms.

## Recommended next implementation sequence

1. Collect and approve the ID Fan / Blower and Cyclone engineering/provenance checklist.
2. Implement conservative technical content, dedicated build-time Hindi/Arabic copy, machine-specific metadata, neutral media links and contextual internal links for those two pages.
3. Obtain dryer type, flow diagram, heat/air system details and real imagery before drafting its detailed page.
4. Address urgent quick wins in a separately approved, minimal correction pass.
5. Re-score Process Tanks, Bag Filter, Portable Belt Conveyor, Bucket Elevator and Vibro Screen after the top-three evidence is resolved.

## Approval decisions required

- Confirm that the ID Fan, Cyclone, Portable Belt, Bag Filter and Chimney media records depict S.K. Engineering Works equipment and may be described publicly.
- Confirm the exact Cyclone installed image attribution.
- Decide whether Chimney should receive a real page or have its detail links withheld until content is ready.
- Confirm Dryer technology before any mechanism-specific copy.
- Approve native technical review for both Hindi and Arabic.

## Reports

- `qa/reports/machinery-catalog-audit/catalog-inventory.md`
- `qa/reports/machinery-catalog-audit/content-seo-audit.md`
- `qa/reports/machinery-catalog-audit/priority-ranking.md`
- `qa/reports/machinery-catalog-audit/engineering-information-needed.md`
- `qa/reports/machinery-catalog-audit/audit-summary.md`

Only these audit documents were added. No application source, styles, translations, routes, media, dependencies or deployment files were modified. No commit or push was performed.
