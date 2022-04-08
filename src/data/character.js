import { generatePoolRollText } from "../lib/roll20lib";
import { objToArray } from "../lib/znzlib";

export const CharacterModel = {
    attributes: {
        strength: {
            key: 'strength',
            abbr: 'STR',
            default: 3,
            tip: "Used for blocking, melee attacks, physical feats, athleticism.",
        },
        agility: {
            key: 'agility',
            abbr: 'AGI',
            default: 3,
            tip: "Used for dodging, ranged attacks, actions involving coordination, skill with your hands/fingers.",
        },
        intellect: {
            key: 'intellect',
            abbr: 'INT',
            default: 3,
            tip: "Used for healing and actions that require thinking and knowledge.",
        },
        charisma: {
            key: 'charisma',
            abbr: 'CHA',
            default: 3,
            tip: "Used for interacting with other human beings.",
        },
        perception: {
            key: 'perception',
            abbr: 'PER',
            default: 3,
            tip: "Ability to sense and notice things in the environment, your reflexes.",
        },
        willpower: {
            key: 'willpower',
            abbr: 'WILL',
            default: 3,
            tip: "Resist physical and mental conditions and damage.",
        },
        luck: {
            key: 'luck',
            abbr: 'LCK',
            default: 3,
            tip: "Determines loot and general chance. ",
        }
    },
    combatskills : {
        block: { key: 'block', uses:'strength', tip:"Reduce damage of an attack by blocking with an item. Add skill amount to a strength roll. Multiply successes by item's block value.", default:0},
        dodge: { key: 'dodge', uses:'agility', tip:'Avoid attacks on yourself. Add skill amount to an agility roll. Each roll success reduces an attacks success.', default:0},
        melee: { key: 'melee', uses:'strength', label: 'Melee', tip:"Skill with melee weapon attacks. Adds skill amount to a strength roll. Multiply successes by an melee weapon's attack value.", default:0},
        ranged: { key: 'ranged', uses:'agility', label: 'Ranged', tip:"Skill with ranged weapon attacks. Adds skill amount to a strength roll. Multiply successes by an ranged weapon's attack value.", default:0},
        run : { key: 'run', uses:'agility', label: 'Running', tip:"Determines how fast you run and if you trip while running.", default:0},
        throwing: { key: 'throwing', uses:'strength', tip: 'Ability to throw an object. Add skill amount to a strength roll.', default:0},
        unarmed: {key: 'unarmed', uses: 'strength', tip: 'Skills with fighting hand to hand and grappling. Add skill amount to a strength roll.', default: 0},
    },
    skills: { 
        count: 4,
        value: {key: 'skill', default: '0'},
        label: {key: 'skill_name'},
        uses: {key: 'skill_uses'},
    },

    resources: {
        health: { key: 'health', default: 100, max: true, tip:"Your character dies when this reaches 0. Lose 1 dice from your Body Pool per 10 health lost."},
        sanity: { key: 'sanity', default: 100, max: true, tip:"Your character goes insane when this reaches 0. Lose 1 dice from your Mind Pool per 10 sanity lost."},
        energy: { key: 'energy', default: 8, max: true, tip:"This is the number of dice in your pool you roll whenever you make any action. Reduced by 1 for every 10 Fatigue."},
        fatigue: { key: 'fatigue', tip:"Every 10 points of fatigue reduces Energy by 1. Every action will usually cause you to gain fatigue."},
        xp: { key: 'EXP', default: 0, max: true,

            tip: [
                "Skill (Max 3): 40XP * LVL",
                "Attribute (Max 6): 50XP * LVL",
                "Ability: 150XP * LVL",
                "Energy: 10XP * LVL",
                "Health/Sanity Max: 20XP",
                '',
                "'LVL' refers to the new value after increasing by 1.",
            ]

        },

    },
    ammo: {
        list: {
            lightammo: {key: 'lightammo', label: 'Primary', tip: 'Pistols, Submachine Guns, Rifles'},
            mediumammo: {key: 'mediumammo', label: 'Heavy', tip: 'Snipers, Shotguns, Magnums'},
            heavyammo: {key: 'heavyammo', label: 'Special', tip:'Bows, Crossbows, Grenade Launchers'},
        }
    },
    bonusrolls: {label: 'Bonus Rolls', key: 'bonusrolls', default: 0, tip:"Adds/subtracts rolls from your pool."},
    rollcost: {label: 'Fatigue Cost', key: 'rollcost', default: 3, tip:"Set how much fatigue does each roll add."},
    rolltype: {label: 'Roll Type', key: 'rolltype', tip: 'If active, rolls will add to your fatigue', options: [
        'active', 
        'free'
    ]},
    equipmentslots: {
        key: "equipmentslots",
        default: 2,
        max: 6,
        slotkey: "equipment"
    },
    inventoryslots: {
        key:"inventoryslots",
        default: 5,
        max: 20,
    },
    inventory:{
        key: "inventory",
    },
    abilities: {
        count: 3,
        selected: {key: 'ability'},
        level: {key:'abilitylevel', label: 'Level'}
    },
    flaws: {
        count: 3,
        selected: {key: 'flaw'}
    },
};


export function lookupAttrAbbr(attr){
    if (attr in CharacterModel.attributes && 'abbr' in CharacterModel.attributes[attr]){
        return CharacterModel.attributes[attr].abbr;
    }

    return '';
}


export function getAttrSelectOptions(){
    return objToArray(CharacterModel.attributes).map((x)=>{
        return {
            key: x.key,
            label: x.abbr
        }
    })
}