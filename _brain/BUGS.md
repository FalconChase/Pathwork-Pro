# BUGS.md
# Pathwork Pro bug register. Project-local IDs (PPB00x). Empty at brain onboarding.
---
| ID | SEVERITY | ITEM | FOUND | STATUS |
|----|----------|------|-------|--------|
| PPB001 | HIGH | Initial scaffold was missing `src-tauri/icons/*` entirely, which crashed `cargo build` on Windows (`icon.ico not found`). `tauri.conf.json` also referenced `icon.icns`, a macOS-only format not needed on Windows. | Pre-brain (early build) | FIXED — PPF001 |
