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
        }
    },
    combatskills : {
        block: { key: 'block', uses:'strength', tip:"Reduce damage of an attack by blocking with an item. Add skill amount to a strength roll. Multiply successes by item's block value.", default:0},
        dodge: { key: 'dodge', uses:'agility', tip:'Avoid attacks on yourself. Add skill amount to an agility roll. Each roll success reduces an attacks success.', default:0},
        melee: { key: 'melee', uses:'strength', label: 'Melee Weapons', tip:"Skill with melee weapon attacks. Adds skill amount to a strength roll. Multiply successes by an melee weapon's attack value.", default:0},
        ranged: { key: 'ranged', uses:'agility', label: 'Ranged Weapons', tip:"Skill with ranged weapon attacks. Adds skill amount to a strength roll. Multiply successes by an ranged weapon's attack value.", default:0},
        throwing: { key: 'throwing', uses:'strength', tip: 'Ability to throw an object. Add skill amount to a strength roll.', default:0},
        unarmed: {key: 'unarmed', uses: 'strength', tip: 'Skills with fighting hand to hand and grappling. Add skill amount to a strength roll.', default: 0},
    },
    skills: { 
        count: 4,
        value: {key: 'skill', default: '0'},
        label: {key: 'skill_name'},
        uses: {key: 'skill_uses'},
    },
    abilities: {
        count: 3,
        selected: {key: 'ability'},
        level: {key:'abilitylevel', label: 'Level'},
        options: [
            {
                key: "sniper",
                label: "Sniper",
                lvl1: "Gain 2 bonus rolls on your next ranged attack this turn.",
                lvl2: "The bonus is now 5.",
                lvl3: "The bonus is now 10."
            },
            {
                key: "cheerleader",
                label: "Cheerleader",
                lvl1: "Spend 1 action to give 2 bonus rolls to adjacent/nearby allies. Increase Fatigue by 10.",
                lvl2: "If you target 1 ally only, they gain bonus rolls equal to your Charisma instead.",
                lvl3: "Fatigue now only increases by 5."
            },
            {
                key: "protector",
                label: "Protector",
                lvl1: "You can take damage directed at adjacent or nearby allies.",
                lvl2: "Excess block exceeding an attack can now be dealt as damage.",
                lvl3: "At the start of your turn, you can enter defensive mode. You take half damage but deal half damage."
            },
            {
                key: "actionstar",
                label: "Action Star",
                lvl1: "Reloading no longer ends your turn and only takes 1 action.",
                lvl2: "If you use one of your actions to defend but no one attacks you, you can re-use that action to attack instead.",
                lvl3: "You can now combine moving and attacking as a single action."
            },

        ]
    },
    flaws: {
        count: 3,
        selected: {key: 'flaw'},
        options: [
            "Afraid of the Dark",
            "Nearsighted",
            "Sickly",
            "Diabetic",
            "Weakly",
            "Unlucky"
        ]
    },
    resources: {
        health: { key: 'health', default: 100, max: true, tip:"Your character dies when this reaches 0. Lose 1 dice from your Body Pool per 10 health lost."},
        sanity: { key: 'sanity', default: 100, max: true, tip:"Your character goes insane when this reaches 0. Lose 1 dice from your Mind Pool per 10 sanity lost."},
        energy: { key: 'energy', default: 8, max: true, tip:"This is the number of dice you roll whenever you make any action. Reduced by 1 for every 10 Fatigue."},
        fatigue: { key: 'fatigue', tip:"Every 10 points of fatigue reduces Energy by 1. Every action will usually cause you to gain fatigue."},
    },
    ammo: {
        list: {
            light: {key: 'ammolight', label: 'Light', tip: 'Pistols, Submachine Guns'},
            medium: {key: 'ammomedium', label: 'Medium', tip: 'Rifles, Shotguns'},
            heavy: {key: 'ammoheavy', label: 'Heavy', tip:'Bows, Crossbows, Snipers'},
        }
    },
    bonusrolls: {label: 'Bonus Rolls', key: 'bonusrolls', default: 0},
    rollcost: {label: 'Fatigue Cost', key: 'rollcost', default: 1},
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
            value: x.key,
            label: x.abbr
        }
    })
}

