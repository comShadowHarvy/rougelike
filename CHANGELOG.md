# Changelog

All notable changes to this project will be documented in this file.

## [1.7] - 2026-02-27
### Added
- Modular directory structure (`src/data`, `src/entities`, `src/systems`, `src/utils`).
- Save/Load system (`src/utils/saveLoad.js`).
- Text‑User‑Interface using **blessed** with map, stats sidebar, and log pane.
- New unit tests for Combat and MapGenerator.
- ESLint and Prettier configurations.
- Build script using `pkg` to produce Linux and Windows binaries.
- Git tag `v1.7` and release archive (`rougelike-release.tar.gz`).

### Fixed
- Resolved lint warnings for unused variables.
- Fixed missing saves directory warning during build.
- Corrected import paths after refactoring.

### Changed
- Updated `Game.js` to act as the main entry point and use the new modular imports.
- Adjusted map generation logic to account for dynamic screen size.
- Improved logging messages and UI prompts.

## [1.0] - 2026-02-25
- Initial release of the Roguelike game (single‑file implementation).

---

