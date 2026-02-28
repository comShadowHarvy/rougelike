const classes = {
    'Meme': {
        'Florida Man': {
            description: 'Unpredictable abilities that can be either very good or very bad.',
            stats: { hp: 100, attack: 10, defense: 5 },
            ability: { name: 'Wrangle Gator', cooldown: 5, turn: 0 },
        },
        'Keyboard Warrior': {
            description: 'High charisma (for trolling), but low strength. Can summon \'trolls\' to fight for them.',
            stats: { hp: 80, attack: 5, defense: 2 },
            canSummon: true,
            ability: { name: 'DDoS', cooldown: 10, turn: 0 },
        },
        'Harambe': {
            description: 'High strength, but will try to protect any child-like creatures.',
            stats: { hp: 150, attack: 15, defense: 10 },
            ability: { name: 'Protect the Innocent', cooldown: 0, turn: 0 },
        },
        'Techno Viking': {
            description: 'A powerful warrior who can intimidate enemies.',
            stats: { hp: 120, attack: 12, defense: 8 },
            ability: { name: 'Intimidating Dance', cooldown: 7, turn: 0 },
        },
        'Distracted Boyfriend': {
            description: 'Has a chance to be distracted by other entities on the map.',
            stats: { hp: 90, attack: 9, defense: 4 },
            ability: { name: 'Double Take', cooldown: 3, turn: 0 },
        },
        'Gigachad': {
            description: 'High stats, but can\'t use items.',
            stats: { hp: 200, attack: 20, defense: 15 },
            ability: { name: 'Refuse to Elaborate', cooldown: 10, turn: 0 },
        },
        'Salt Bae': {
            description: 'Low attack, but can \'sprinkle\' salt on enemies, dealing a small amount of damage to all enemies on screen.',
            stats: { hp: 90, attack: 2, defense: 2 },
            ability: { name: 'Sprinkle Salt', cooldown: 5, turn: 0 },
        },
        'Big Brain': {
            description: 'Low physical stats, but has a powerful psychic blast ability.',
            stats: { hp: 70, attack: 5, defense: 3 },
            ability: { name: 'Psychic Blast', cooldown: 8, turn: 0 },
        },
        'Chad': {
            description: 'High charisma, can sometimes make enemies fight each other.',
            stats: { hp: 100, attack: 10, defense: 6 },
            ability: { name: 'Incite Infighting', cooldown: 10, turn: 0 },
        },
        'Karen': {
            description: 'Can \'speak to the manager\', causing a random boss to spawn.',
            stats: { hp: 80, attack: 8, defense: 4 },
            ability: { name: 'Speak to the Manager', cooldown: 20, turn: 0 },
        },
        'Stonks Guy': {
            description: 'Can manipulate the market (stats).',
            stats: { hp: 110, attack: 5, defense: 10 },
            ability: { name: 'Hodl', cooldown: 5, turn: 0 },
        },
        'Doge': {
            description: 'Such wow. Very stats.',
            stats: { hp: 90, attack: 8, defense: 6 },
            ability: { name: 'Bark', cooldown: 4, turn: 0 },
        },
        'Nyan Cat': {
            description: 'Leaves a rainbow trail.',
            stats: { hp: 70, attack: 6, defense: 3 },
            ability: { name: 'Zoomies', cooldown: 3, turn: 0 },
        },
        'Simp': {
            description: 'Defends others at all costs.',
            stats: { hp: 120, attack: 4, defense: 8 },
            ability: { name: 'White Knight', cooldown: 6, turn: 0 },
        },
        'Trollface': {
            description: 'Problem?',
            stats: { hp: 100, attack: 7, defense: 5 },
            ability: { name: 'U Mad?', cooldown: 8, turn: 0 },
        },
        'This is Fine Dog': {
            description: 'Ignores the fire around them.',
            stats: { hp: 80, attack: 5, defense: 5 },
            ability: { name: 'Ignore Fire', cooldown: 10, turn: 0 },
        }
    },
    'Pathfinder': {
        'Alchemist': {
            description: 'Can throw bombs and use mutagens.',
            stats: { hp: 90, attack: 8, defense: 6 },
            ability: { name: 'Throw Bomb', cooldown: 5, turn: 0 },
        },
        'Magus': {
            description: 'A warrior who can cast spells.',
            stats: { hp: 100, attack: 12, defense: 8 },
            ability: { name: 'Spellstrike', cooldown: 4, turn: 0 },
        },
        'Summoner': {
            description: 'Can summon an Eidolon to fight alongside them.',
            stats: { hp: 80, attack: 6, defense: 4 },
            canSummon: true,
            ability: { name: 'Summon Eidolon', cooldown: 10, turn: 0 },
        },
        'Inquisitor': {
            description: 'A divine warrior who can pronounce judgments on their foes.',
            stats: { hp: 100, attack: 10, defense: 7 },
            ability: { name: 'Judgment', cooldown: 6, turn: 0 },
        },
        'Oracle': {
            description: 'A divine spellcaster with a mysterious curse that also grants them power.',
            stats: { hp: 85, attack: 7, defense: 5 },
            ability: { name: 'Curse', cooldown: 5, turn: 0 },
        },
        'Barbarian': {
            description: 'Enters a rage, increasing attack and decreasing defense.',
            stats: { hp: 130, attack: 14, defense: 4 },
            ability: { name: 'Rage', cooldown: 8, turn: 0 },
        },
        'Rogue': {
            description: 'Can backstab for extra damage if they attack an enemy from behind.',
            stats: { hp: 90, attack: 9, defense: 5 },
            ability: { name: 'Backstab', cooldown: 4, turn: 0 },
        },
        'Fighter': {
            description: 'Can make an extra attack in a turn.',
            stats: { hp: 110, attack: 11, defense: 7 },
            ability: { name: 'Extra Attack', cooldown: 6, turn: 0 },
        },
        'Monk': {
            description: 'Can move and attack in the same turn.',
            stats: { hp: 95, attack: 10, defense: 6 },
            ability: { name: 'Flurry of Blows', cooldown: 5, turn: 0 },
        },
        'Ranger': {
            description: 'Has a pet companion and is skilled with a bow.',
            stats: { hp: 100, attack: 10, defense: 6 },
            canSummon: true,
            ability: { name: 'Summon Pet', cooldown: 10, turn: 0 },
        },
        'Cavalier': {
            description: 'A mounted warrior skilled in charging.',
            stats: { hp: 120, attack: 12, defense: 8 },
            ability: { name: 'Challenge', cooldown: 5, turn: 0 },
        },
        'Witch': {
            description: 'Uses hexes to debilitate enemies.',
            stats: { hp: 70, attack: 6, defense: 4 },
            ability: { name: 'Evil Eye', cooldown: 4, turn: 0 },
        },
        'Bloodrager': {
            description: 'Combines arcane power with potential rage.',
            stats: { hp: 110, attack: 13, defense: 5 },
            ability: { name: 'Bloodrage', cooldown: 8, turn: 0 },
        },
        'Skald': {
            description: 'Inspires rage in allies.',
            stats: { hp: 100, attack: 9, defense: 6 },
            ability: { name: 'Raging Song', cooldown: 6, turn: 0 },
        },
        'Shaman': {
            description: 'Communes with spirits.',
            stats: { hp: 85, attack: 7, defense: 5 },
            ability: { name: 'Spirit Animal', cooldown: 10, turn: 0 },
        },
        'Slayer': {
            description: 'Specializes in taking down specific targets.',
            stats: { hp: 100, attack: 11, defense: 6 },
            ability: { name: 'Studied Target', cooldown: 5, turn: 0 },
        }
    },
    'D&D': {
        'Artificer': {
            description: 'Can create magical items.',
            stats: { hp: 90, attack: 7, defense: 7 },
            ability: { name: 'Infuse Item', cooldown: 8, turn: 0 },
        },
        'Warlock': {
            description: 'Gets powers from a powerful patron.',
            stats: { hp: 85, attack: 10, defense: 5 },
            ability: { name: 'Eldritch Blast', cooldown: 3, turn: 0 },
        },
        'Bard': {
            description: 'Uses music to cast spells and inspire allies.',
            stats: { hp: 80, attack: 6, defense: 6 },
            ability: { name: 'Inspire Courage', cooldown: 10, turn: 0 },
        },
        'Druid': {
            description: 'Can shapeshift into animal forms.',
            stats: { hp: 95, attack: 8, defense: 8 },
            ability: { name: 'Wild Shape', cooldown: 12, turn: 0 },
        },
        'Paladin': {
            description: 'A holy warrior bound by an oath.',
            stats: { hp: 110, attack: 11, defense: 9 },
            ability: { name: 'Lay on Hands', cooldown: 8, turn: 0 },
        },
        'Wizard': {
            description: 'Can cast a variety of powerful spells.',
            stats: { hp: 75, attack: 5, defense: 4 },
            ability: { name: 'Fireball', cooldown: 7, turn: 0 },
        },
        'Cleric': {
            description: 'Can heal allies and smite undead.',
            stats: { hp: 90, attack: 8, defense: 7 },
            ability: { name: 'Turn Undead', cooldown: 10, turn: 0 },
        },
        'Sorcerer': {
            description: 'A spellcaster who draws power from their bloodline.',
            stats: { hp: 80, attack: 6, defense: 5 },
            ability: { name: 'Metamagic', cooldown: 6, turn: 0 },
        },
        'Monk (D&D)': {
            description: 'Uses ki to perform special attacks.',
            stats: { hp: 95, attack: 10, defense: 7 },
            ability: { name: 'Stunning Strike', cooldown: 5, turn: 0 },
        },
        'Ranger (D&D)': {
            description: 'A skilled hunter and tracker.',
            stats: { hp: 100, attack: 10, defense: 6 },
            ability: { name: 'Hunter\'s Mark', cooldown: 6, turn: 0 },
        },
        'Necromancer': {
            description: 'Masters of death and undeath.',
            stats: { hp: 70, attack: 6, defense: 3 },
            ability: { name: 'Raise Dead', cooldown: 15, turn: 0 },
        },
        'Illusionist': {
            description: 'Deceives enemies with magical illusions.',
            stats: { hp: 75, attack: 5, defense: 5 },
            ability: { name: 'Mirror Image', cooldown: 8, turn: 0 },
        },
        'Battlemaster': {
            description: 'A master of martial combat techniques.',
            stats: { hp: 115, attack: 12, defense: 8 },
            ability: { name: 'Maneuvers', cooldown: 6, turn: 0 },
        },
        'Assassin': {
            description: 'Deadly killer striking from the shadows.',
            stats: { hp: 85, attack: 14, defense: 4 },
            ability: { name: 'Assassinate', cooldown: 10, turn: 0 },
        },
        'Storm Sorcerer': {
            description: 'Controls the power of the storm.',
            stats: { hp: 80, attack: 9, defense: 5 },
            ability: { name: 'Tempest', cooldown: 7, turn: 0 },
        },
        'Life Cleric': {
            description: 'Dedicated to healing and restoration.',
            stats: { hp: 95, attack: 7, defense: 8 },
            ability: { name: 'Preserve Life', cooldown: 12, turn: 0 },
        }
    },
    'Overpowered': {
        'God': {
            description: 'Can do anything.',
            stats: { hp: 1000, attack: 100, defense: 100 },
            ability: { name: 'Smite', cooldown: 20, turn: 0 },
        },
        'Saitama': {
            description: 'Can defeat any enemy with a single punch.',
            stats: { hp: 1000, attack: 9999, defense: 1000 },
            ability: { name: 'Serious Punch', cooldown: 30, turn: 0 },
        },
        'The Author': {
            description: 'Can manipulate the game world directly.',
            stats: { hp: 999, attack: 999, defense: 999 },
            ability: { name: 'Rewrite Reality', cooldown: 50, turn: 0 },
        },
        'The One Above All': {
            description: 'The ultimate being, a step above a God.',
            stats: { hp: 9999, attack: 9999, defense: 9999 },
            ability: { name: 'Omnipotence', cooldown: 100, turn: 0 },
        },
        'Giorno Giovanna (GER)': {
            description: 'Can nullify any action directed at them.',
            stats: { hp: 1000, attack: 100, defense: 9999 },
            ability: { name: 'Return to Zero', cooldown: 60, turn: 0 },
        },
        'Chuck Norris': {
            description: 'Roundhouse kicks an enemy, sending them to another dimension.',
            stats: { hp: 10000, attack: 10000, defense: 10000 },
            ability: { name: 'Roundhouse Kick', cooldown: 10, turn: 0 },
        },
        'John Wick': {
            description: 'Enters a \'John Wick\' mode, where he can make multiple attacks in a turn.',
            stats: { hp: 500, attack: 50, defense: 30 },
            ability: { name: 'Gunslinger', cooldown: 15, turn: 0 },
        },
        'Thanos': {
            description: '50% chance to wipe out half of all enemies on the map.',
            stats: { hp: 2000, attack: 200, defense: 200 },
            ability: { name: 'Snap', cooldown: 100, turn: 0 },
        },
        'The Flash': {
            description: 'Can take multiple turns in a row.',
            stats: { hp: 300, attack: 30, defense: 20 },
            ability: { name: 'Speedforce', cooldown: 20, turn: 0 },
        },
        'Dr. Manhattan': {
            description: 'Can see the future, allowing the player to re-roll a failed action.',
            stats: { hp: 10000, attack: 10000, defense: 10000 },
            ability: { name: 'Quantum Immortality', cooldown: 100, turn: 0 },
        },
        'Doom Slayer': {
            description: 'Rip and Tear, until it is done.',
            stats: { hp: 1500, attack: 150, defense: 150 },
            ability: { name: 'BFG 9000', cooldown: 25, turn: 0 },
        },
        'Kratos': {
            description: 'The Ghost of Sparta.',
            stats: { hp: 1200, attack: 130, defense: 100 },
            ability: { name: 'Spartan Rage', cooldown: 20, turn: 0 },
        },
        'Goku': {
            description: 'Earth\'s greatest defender.',
            stats: { hp: 1100, attack: 140, defense: 90 },
            ability: { name: 'Kamehameha', cooldown: 15, turn: 0 },
        },
        'Superman': {
            description: 'Faster than a speeding bullet.',
            stats: { hp: 2000, attack: 180, defense: 180 },
            ability: { name: 'Heat Vision', cooldown: 10, turn: 0 },
        },
        'Rick Sanchez': {
            description: 'Smartest man in the universe.',
            stats: { hp: 500, attack: 80, defense: 40 },
            ability: { name: 'Portal Gun', cooldown: 30, turn: 0 },
        },
        'Shaggy': {
            description: 'Uses 0.001% of his power.',
            stats: { hp: 5000, attack: 500, defense: 5000 },
            ability: { name: 'Zoinks', cooldown: 40, turn: 0 },
        }
    },
    'Discworld': {
        'Rincewind': { 'description': 'A wizzard who is very good at running away.', 'stats': { 'hp': 100, 'attack': 2, 'defense': 2 }, 'ability': { 'name': 'Run Away', 'cooldown': 2, 'turn': 0 } },
        'Sam Vimes': { 'description': 'Commander of the City Watch.', 'stats': { 'hp': 120, 'attack': 10, 'defense': 10 }, 'ability': { 'name': 'Knuckle Sandwich', 'cooldown': 5, 'turn': 0 } },
        'Granny Weatherwax': { 'description': 'A powerful witch who uses headology.', 'stats': { 'hp': 90, 'attack': 12, 'defense': 8 }, 'ability': { 'name': 'Headology', 'cooldown': 6, 'turn': 0 } },
        'Nanny Ogg': { 'description': 'A witch with a very large cat.', 'stats': { 'hp': 110, 'attack': 8, 'defense': 8 }, 'canSummon': true, 'ability': { 'name': 'Grebbo', 'cooldown': 10, 'turn': 0 } },
        'Death': { 'description': 'The anthropomorphic personification.', 'stats': { 'hp': 200, 'attack': 20, 'defense': 15 }, 'ability': { 'name': 'SQUEAK', 'cooldown': 15, 'turn': 0 } },
        'The Librarian': { 'description': 'Orangutan. Don\'t say the M-word.', 'stats': { 'hp': 130, 'attack': 15, 'defense': 10 }, 'ability': { 'name': 'Oook!', 'cooldown': 8, 'turn': 0 } },
        'Cohen the Barbarian': { 'description': 'Legendary hero, very old.', 'stats': { 'hp': 100, 'attack': 12, 'defense': 5 }, 'canSummon': true, 'ability': { 'name': 'Silver Horde', 'cooldown': 12, 'turn': 0 } },
        'Captain Carrot': { 'description': 'Everyone likes him.', 'stats': { 'hp': 140, 'attack': 14, 'defense': 12 }, 'ability': { 'name': 'Arrest', 'cooldown': 6, 'turn': 0 } },
        'Susan Sto Helit': { 'description': 'Death\'s granddaughter.', 'stats': { 'hp': 100, 'attack': 10, 'defense': 8 }, 'ability': { 'name': 'Poker', 'cooldown': 5, 'turn': 0 } },
        'Twoflower': { 'description': 'The first tourist.', 'stats': { 'hp': 80, 'attack': 1, 'defense': 1 }, 'canSummon': true, 'ability': { 'name': 'The Luggage', 'cooldown': 20, 'turn': 0 } },
        'Lord Vetinari': { 'description': 'The Patrician of Ankh-Morpork.', 'stats': { 'hp': 90, 'attack': 5, 'defense': 20 }, 'ability': { 'name': 'Politics', 'cooldown': 10, 'turn': 0 } },
        'Angua': { 'description': 'A werewolf in the Watch.', 'stats': { 'hp': 110, 'attack': 12, 'defense': 8 }, 'ability': { 'name': 'Wolf Form', 'cooldown': 10, 'turn': 0 } },
        'Detritus': { 'description': 'A troll sergeant.', 'stats': { 'hp': 200, 'attack': 15, 'defense': 15 }, 'ability': { 'name': 'Piecemaker', 'cooldown': 8, 'turn': 0 } },
        'Moist von Lipwig': { 'description': 'Postmaster General.', 'stats': { 'hp': 90, 'attack': 6, 'defense': 6 }, 'ability': { 'name': 'Con', 'cooldown': 5, 'turn': 0 } },
        'Tiffany Aching': { 'description': 'A young witch.', 'stats': { 'hp': 85, 'attack': 8, 'defense': 6 }, 'canSummon': true, 'ability': { 'name': 'Nac Mac Feegle', 'cooldown': 8, 'turn': 0 } }
    },
    'Warhammer': {
        'Space Marine': { 'description': 'A super-soldier of the Imperium.', 'stats': { 'hp': 150, 'attack': 15, 'defense': 15 }, 'ability': { 'name': 'Bolter Fire', 'cooldown': 5, 'turn': 0 } },
        'Ork Boy': { 'description': 'WAAAGH!', 'stats': { 'hp': 140, 'attack': 14, 'defense': 8 }, 'ability': { 'name': 'WAAAGH!', 'cooldown': 8, 'turn': 0 } },
        'Eldar Farseer': { 'description': 'A powerful psychic seer.', 'stats': { 'hp': 90, 'attack': 10, 'defense': 8 }, 'ability': { 'name': 'Psychic Storm', 'cooldown': 6, 'turn': 0 } },
        'Chaos Marine': { 'description': 'Servant of the Dark Gods.', 'stats': { 'hp': 150, 'attack': 16, 'defense': 14 }, 'ability': { 'name': 'Mark of Chaos', 'cooldown': 10, 'turn': 0 } },
        'Tyranid': { 'description': 'The Great Devourer.', 'stats': { 'hp': 120, 'attack': 14, 'defense': 10 }, 'ability': { 'name': 'Devour', 'cooldown': 5, 'turn': 0 } },
        'Necron Warrior': { 'description': 'Ancient mechanical warrior.', 'stats': { 'hp': 160, 'attack': 12, 'defense': 16 }, 'ability': { 'name': 'Reanimation Protocols', 'cooldown': 20, 'turn': 0 } },
        'Sister of Battle': { 'description': 'Warrior of the Ecclesiarchy.', 'stats': { 'hp': 110, 'attack': 12, 'defense': 10 }, 'ability': { 'name': 'Flamer', 'cooldown': 6, 'turn': 0 } },
        'Tech-Priest': { 'description': 'Servant of the Omnissiah.', 'stats': { 'hp': 100, 'attack': 8, 'defense': 12 }, 'ability': { 'name': 'Rite of Repair', 'cooldown': 10, 'turn': 0 } },
        'Commissar': { 'description': 'Enforcer of discipline.', 'stats': { 'hp': 100, 'attack': 10, 'defense': 8 }, 'ability': { 'name': 'Execute', 'cooldown': 15, 'turn': 0 } },
        'Grey Knight': { 'description': 'Daemon hunter.', 'stats': { 'hp': 160, 'attack': 18, 'defense': 16 }, 'ability': { 'name': 'Nemesis Force', 'cooldown': 8, 'turn': 0 } },
        'Slayer': { 'description': 'Seeks a glorious death.', 'stats': { 'hp': 120, 'attack': 20, 'defense': 0 }, 'ability': { 'name': 'Deathblow', 'cooldown': 5, 'turn': 0 } },
        'Warrior Priest': { 'description': 'Hammer of Sigmar.', 'stats': { 'hp': 130, 'attack': 14, 'defense': 12 }, 'ability': { 'name': 'Sigmar\'s Wrath', 'cooldown': 8, 'turn': 0 } },
        'Witch Hunter': { 'description': 'Purges heresy.', 'stats': { 'hp': 110, 'attack': 12, 'defense': 8 }, 'ability': { 'name': 'Accusation', 'cooldown': 6, 'turn': 0 } },
        'Skaven': { 'description': 'Rat-man assassin.', 'stats': { 'hp': 80, 'attack': 12, 'defense': 4 }, 'ability': { 'name': 'Doomrocket', 'cooldown': 10, 'turn': 0 } },
        'Custodes': { 'description': 'Guardian of the Emperor.', 'stats': { 'hp': 250, 'attack': 25, 'defense': 25 }, 'ability': { 'name': 'Guardian Spear', 'cooldown': 12, 'turn': 0 } }
    },
    'Mythic': {
        'Phoenix': {
            description: 'Reborn from ashes, deals fire damage.',
            stats: { hp: 150, attack: 20, defense: 10 },
            ability: { name: 'Flame Rebirth', cooldown: 12, turn: 0 },
        },
        'Kraken': {
            description: 'Giant sea monster with tentacles.',
            stats: { hp: 300, attack: 25, defense: 15 },
            ability: { name: 'Tentacle Crush', cooldown: 10, turn: 0 },
        },
        'Lich': {
            description: 'Undead sorcerer that drains life.',
            stats: { hp: 120, attack: 15, defense: 5 },
            ability: { name: 'Life Drain', cooldown: 8, turn: 0 },
        },
    },
};

module.exports = classes;
