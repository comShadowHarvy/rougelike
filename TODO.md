# Project Improvement Plan

## 1. Refactoring (High Priority)
The current `game.js` is a large monolith. Splitting it into modules is essential for maintainability.
- [ ] **Create Directory Structure**: Set up `src/` with `data/`, `entities/`, `systems/`, and `utils/`.
- [ ] **Extract Data**: Move `items`, `monsterTypes`, `bossTypes`, `summonTypes`, and `classes` to `src/data/`.
- [ ] **Extract Entities**: Create `Player` and `Monster` classes in `src/entities/`.
- [ ] **Extract Systems**: Move map generation, combat logic, and input handling to `src/systems/`.
- [ ] **Main Entry Point**: Refactor `game.js` to initialize and run the game using the new modules.

## 2. Infrastructure & DevOps
- [ ] **Linting & Formatting**: Install ESLint and Prettier to enforce code style.
- [ ] **Build Scripts**: Update `package.json` scripts for development and building.

## 3. Reliability & Testing
- [ ] **Unit Tests**: Add Jest or Mocha.
- [ ] **Test Combat**: Logic verification for attacks, damage, and abilities.
- [ ] **Test Map Gen**: Verify dungeon generation constraints and connectivity.

## 4. New Features
- [ ] **Save/Load System**: Implement JSON serialization for game state to allow saving progress.
- [ ] **Enhanced UI**: Replace raw console logs with a TUI library (e.g., `blessed` or `ink`) for better visuals and input management.
