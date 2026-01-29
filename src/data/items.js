const items = {
    weapons: {
        "Dagger": { attack: 5, name: "Dagger", type: "weapons" },
        "Short Sword": { attack: 8, name: "Short Sword", type: "weapons" },
        "Long Sword": { attack: 12, name: "Long Sword", type: "weapons" },
    },
    armor: {
        "Leather Armor": { defense: 5, name: "Leather Armor", type: "armor" },
        "Chainmail": { defense: 8, name: "Chainmail", type: "armor" },
        "Plate Armor": { defense: 12, name: "Plate Armor", type: "armor" },
    },
    potions: {
        "Healing Potion": { effect: "heal", value: 50, name: "Healing Potion", type: "potions" },
        "Strength Potion": { effect: "strength_buff", value: 10, duration: 10, name: "Strength Potion", type: "potions" },
    },
    scrolls: {
        "Scroll of Teleportation": { effect: "teleport", name: "Scroll of Teleportation", type: "scrolls" },
        "Scroll of Monster Stun": { effect: "monster_stun", name: "Scroll of Monster Stun", type: "scrolls" },
        "Scroll of Reveal Map": { effect: "reveal_map", name: "Scroll of Reveal Map", type: "scrolls" },
    },
    legendary: {
        "Excalibur": { attack: 50, name: "Excalibur", type: "weapons" },
        "Aegis": { defense: 50, name: "Aegis", type: "armor" },
    }
};

module.exports = items;
