# Centrifuge content audit

Date: 2026-11-11
Baseline: `a022ff854f8f949d65991da1675ceb86d57cb08a`

## Evidence reviewed

- Static detail routes exist at `/machinery/centrifuge/`, `/hi/machinery/centrifuge/` and `/ar/machinery/centrifuge/`.
- The page uses the shared 11-section machinery-detail layout and existing digital-inspection placeholder.
- `public/images/machinery/catalog/centrifuge.webp` is a transparent catalog render. It visibly shows a motor, guarded drive, enclosed cylindrical housing, front process connections, lifting points and a base frame.
- The render does not establish the centrifuge type, internal rotor or basket, filter medium, solids-discharge method, continuous or batch operation, speed, capacity, material or performance.
- A Royal Salt project record mentions centrifuge equipment, but the repository does not provide a machine-specific image or technical record that connects the catalog render or this exact configuration to that project.

## Baseline weaknesses

The previous page stated that moisture was separated before drying but did not distinguish centrifugal dewatering from thermal drying. Its component and working descriptions were generic, configuration guidance omitted operating mode, feed condition, vibration and discharge arrangements, and the enquiry copy was not machine-specific. Complete Hindi and Arabic build-time technical copy and conservative Product structured data were absent.

## Safe implementation direction

Retain the existing layout, image, controls and enquiry behavior. Describe the general principle of centrifugal separation, identify only visible external assemblies as verified, treat internal construction and operating mode as confirmation items, and withhold all numerical and project claims.
