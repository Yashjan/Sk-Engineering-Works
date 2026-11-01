# Machinery detail content

Use the approved Screw Washer structure for non-3D pages. Register the machine's
configuration in `index.ts`; keep custom cinematics behind the experience adapter.

## Machinery images

Before configuring a machine, inspect existing assets under `public/images/`,
particularly `public/images/machinery/catalog/`. Prefer the existing matching
asset and keep machine-specific proof under its owning machinery folder. Existing
project-owned images in other formats may be retained. Do not generate images,
convert an existing image unnecessarily, use stock images, or substitute another
machine.

If no matching image exists, omit `hero`. The shared media component renders
“MACHINE IMAGE / COMING SOON” for absent or missing files, and also handles image
load errors. This placeholder does not imply that the machine itself is unavailable.

## Enquiry

Pass `config.enquiry` to `MachineryEnquiry`. `machineName` is included in the
read-only form field, the prepared enquiry details, and both WhatsApp messages.
Optional `sectionNumber`, `heading`, and `description` customize page context.
The component prepares a WhatsApp draft; it does not send or submit to a backend.
