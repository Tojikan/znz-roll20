export const CharacterModel = {
    attributes: {
        strength: {
            key: 'strength',
            abbr: 'STR',
            default: 3
        },
        agility: {
            key: 'agility',
            abbr: 'AGI',
            default: 3
        },
        intellect: {
            key: 'intellect',
            abbr: 'INT',
            default: 3
        },
        charisma: {
            key: 'charisma',
            abbr: 'CHA',
            default: 3
        },
        perception: {
            key: 'perception',
            abbr: 'PER',
            default: 3
        },
        willpower: {
            key: 'willpower',
            abbr: 'WILL',
            default: 3
        }
    },
    combatskills : {
        bladedmelee: { key: 'sharpmelee', uses:'agility', label: 'Bladed Melee', tip:'Skill with a sharp weapon.', default:0},
        bluntmelee: { key: 'bluntmelee', uses:'strength', label: 'Blunt Melee', tip:'Whacking something with something hard.', default:0},
        block: { key: 'block', uses:'strength', tip:'Reduce damage of an attack.', default:0},
        dodge: { key: 'dodge', uses:'agility', tip:'Avoid an attack', default:0},
        throwing: { key: 'throwing', uses:'strength', tip: 'Throw things.', default:0},
        firearm: { key: 'firearms', uses:'perception',tip:'Shoot something with a gun.', default:0},
        projectile: { key: 'projectiles', uses:'agility', tip:'Skills with bows, crossbows, slings, or launched ammunition.', default:0},
        unarmed: {key: 'unarmed', uses: 'strength', tip: 'Skills with fighting hand to hand and grappling.', default: 0},
    },
    resources: {
        health: { key: 'health', default: 100, max: true, tip:"Your character dies when this reaches 0. Lose 1 dice from your Body Pool per 10 health lost."},
        sanity: { key: 'sanity', default: 100, max: true, tip:"Your character goes insane when this reaches 0. Lose 1 dice from your Mind Pool per 10 sanity lost."},
        energy: { key: 'energy', default: 8, max: true, tip:"This is the number of dice you roll whenever you make any action. Reduced by 1 for every 10 Fatigue."},
        fatigue: { key: 'fatigue', tip:"Every 10 points of fatigue reduces Energy by 1. Every action will usually cause you to gain fatigue."},
    },
    ammo: {
        list: {
            light: {key: 'ammolight', label: 'Light'},
            medium: {key: 'ammomedium', label: 'Medium'},
            heavy: {key: 'ammoheavy', label: 'Heavy'}
        }
    },
    bonusrolls: {label: 'Bonus Rolls', key: 'bonusrolls', default: 0},
    rollcost: {label: 'Fatigue Cost', key: 'rollcost', default: 1},
}