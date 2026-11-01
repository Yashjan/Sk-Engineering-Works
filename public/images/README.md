# Image organization

- `common/` contains brand assets, client logos, and field media reused across pages.
- `home/` contains homepage-only media.
- `machinery/catalog/` contains reusable machine renders; page-specific proof lives under `machinery/` beside it.
- `projects/` contains project-page media, grouped by project or equipment record.
- `salt-refinery/` contains assets owned only by the salt refinery page, such as plant-layout drawings.

Use lowercase kebab-case names for new files and place each asset with the page or feature that owns it. Move an asset to `common/` only when more than one section genuinely reuses it.
