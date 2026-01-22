# CLI Roguelike Game

A classic roguelike game that runs in your terminal, built with Node.js.

## Features

*   **Class-based characters:** Choose from a variety of classes, including:
    *   **Meme classes:** Florida Man, Keyboard Warrior, Harambe, and more.
    *   **Pathfinder classes:** Alchemist, Magus, Summoner, and more.
    *   **D&D classes:** Artificer, Warlock, Bard, and more.
    *   **Overpowered classes:** God, Saitama, The Author, and more.
*   **Procedurally generated dungeons:** Every playthrough is a new experience with dynamic map generation.
*   **Turn-based combat:** Fight monsters in classic roguelike fashion.
*   **Field of View (FOV):** Explore the dungeon and uncover the map as you go.
*   **Stairs and multiple levels:** Descend deeper into the dungeon.
*   **Bosses:** Encounter powerful bosses every 5 levels, and a big boss every 15 levels.
*   **Items and Loot:** Find weapons, armor, potions, scrolls, and legendary items in chests.
*   **Inventory System:** Manage your specific inventory and equipment.
*   **Summons:** Some classes can summon creatures to fight alongside them.
*   **Special Abilities:** Each class has a unique ability (cooldown-based).
*   **Trap System:** Watch your step! Hidden traps like Spike Pits and Poison Gas are scattered throughout the dungeon.
*   **Automation:** Optional auto-combat and auto-heal features.
*   **Battle Aftermath:** Enemies leave behind corpses upon defeat.
*   **Leveling system:** Gain experience and level up to become more powerful.
*   **Permadeath:** If you die, you have to start over.

## How to Play

1.  **Install Node.js:** If you don't have it already, download and install Node.js from the official website.
2.  **Run the game:** Open your terminal, navigate to the project directory, and run the following command:
    ```
    node game.js
    ```
3.  **Controls:**
    *   **Movement:** `w`, `a`, `s`, `d`
    *   **Heal:** `h`
    *   **Summon:** `u`
    *   **Use Ability:** `b`
    *   **Open Inventory:** `i`
    *   **Toggle Auto-Combat:** `c`
    *   **Toggle Auto-Heal:** `x`
    *   **Equip Item:** `e`
    *   **Go down stairs:** `>`
    *   **Go up stairs:** `<`
    *   **Exit:** `ctrl+c`

## Building

To create a standalone executable for Linux and Windows, run:

```bash
npm install
npm run build
```

The executables will be created in the `release/` directory.

## Author

*   **ShadowHarvy**
