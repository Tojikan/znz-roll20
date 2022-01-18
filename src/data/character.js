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
    abilities: {
        count: 3,
        selected: {key: 'ability'},
        level: {key:'abilitylevel', label: 'Level'},
        options: [
            {
                key: "sniper",
                label: "Sniper",
                levels: [
                    {
                        label: "Aimed Shot",
                        tip: "Spend 1 action to gain 4 bonus rolls on your next ranged attack this turn.",
                    },
                    {
                        label: "Enhanced Aimed Shot",
                        tip: "Your Aimed shot now adds 6 bonus rolls. You can now accumulate 2 aimed shots in one turn to apply it to a ranged attack next turn as long as the attack is the first action you take.",
                    },
                    {
                        label: "Critical Strike",
                        tip: "Anytime you have 10 or more successes on a ranged attack, deal double damage."
                    }

                ],
            },
            {
                key: "cheerleader",
                label: "Cheerleader",
                levels: [
                    {
                        label: "Go Team Go!",
                        tip: "Spend 1 action to give 2 bonus rolls to adjacent/nearby allies. Increase Fatigue by 10."
                    },
                    {
                        label: "You can do it!",
                        tip: "Target 1 ally. They gain bonus rolls equal to your Charisma instead. Increase Fatigue by 10.",
                    },
                    {
                        label: "Cheering you on!",
                        tip: "Fatigue Cost for Cheerleader actions now only increases by 5.",
                    },
                ]
            },
            {
                key: "protector",
                label: "Protector",
                levels: [
                    {
                        label: "Stay Behind Me",
                        tip: "You can take damage directed at adjacent or nearby allies."
                    },
                    {
                        label: "Shield Bash",
                        tip: "Excess block exceeding an attack can now be dealt as damage."
                    },
                    {
                        label: "Turtle Mode",
                        tip: "At the start of your turn, you can enter defensive mode. You take half damage but deal half damage."
                    }
                ]
            },
            {
                key: "actionstar",
                label: "Action Star",
                levels: [
                    {
                        label: "Active Reload",
                        tip: "You can now combine reloading and moving. Reloading no longer ends your attack phase (you can now attack right after reloading)."
                    },
                    {
                        label: "Hit and Run",
                        tip: "You can now combine moving and attacking as a single action with a -4 roll penalty."
                    }
                ]
            },
        ]
    },
    flaws: {
        count: 3,
        selected: {key: 'flaw'},
        options: [
            {
                label: "Afraid of the Dark",
                key: 'dark',
                tip: "Bonus Rolls will always be set to -4 in low-light/dark environments.",
            },
            {
                label: "Nearsighted",
                key: "nearsighted",
                tip: "Taking damage or failing an action can cause you to drop your glasses. Bonus rolls are set to -6 when your glasses are dropped.",
            },
            {
                label: "Sickly",
                key: "sickly",
                tip: "You must take special medicine every day or else reduce your current health by 50%, minimum of 10. Start the game with 3 special medicine.",
            },
            {
                label: "Out of Breath",
                key: "weakly",
                tip: "Set your Fatigue Cost to 4.",
            },
            {
                label: "Unlucky",
                key: 'unlucky',
                tip: 'Bad things seem to happen around you.',
            },
            {
                label: "Clumsy",
                key: 'clumsy',
                tip: 'Your character occasionally trips or knocks things over.',
            },
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
            light: {key: 'ammolight', label: 'Primary', tip: 'Pistols, Submachine Guns, Rifles'},
            medium: {key: 'ammomedium', label: 'Heavy', tip: 'Snipers, Shotguns, Magnums'},
            heavy: {key: 'ammoheavy', label: 'Special', tip:'Bows, Crossbows, Grenade Launchers'},
        }
    },
    bonusrolls: {label: 'Bonus Rolls', key: 'bonusrolls', default: 0},
    rollcost: {label: 'Fatigue Cost', key: 'rollcost', default: 3},
    rolltype: {label: 'Roll Type', key: 'rolltype', options: [
        'active', 
        'free'
    ]},
    equipmentslots: {
        key: "equipmentslots",
        default: 2,
        count: 6,
        slotkey: "equipment"
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
            value: x.key,
            label: x.abbr
        }
    })
}


