import { generatePoolRollCommand } from "../lib/roll20lib";
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
            light: {key: 'ammolight', label: 'Primary', tip: 'Pistols, Submachine Guns, Rifles'},
            medium: {key: 'ammomedium', label: 'Heavy', tip: 'Snipers, Shotguns, Magnums'},
            heavy: {key: 'ammoheavy', label: 'Special', tip:'Bows, Crossbows, Grenade Launchers'},
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
                key: "encyclopedia",
                label: "Encyclopedia",
                levels: [
                    {
                        label: "Memory",
                        tip: "You can attempt simple skills that you do not have with a -4 roll penalty. You cannot gain bonus rolls for this attempt.",
                    },
                    {
                        label: "Knowledge",
                        tip: "Spend 5 sanity. Get a helpful tip from the ZM.",
                    },
                    {
                        label: "Mastery",
                        tip: "Gain double XP."
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
                        label: "If you can't do it!",
                        tip: "Spend 1 action to target 1 ally. They gain bonus rolls equal to your Charisma. Increase Fatigue by 5.",
                    },
                    {
                        label: "Nobody can!",
                        tip: "Bonus rolls persist through the end of combat. Rolls do not stack.",
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
                    },
                    {
                        label: "Bullet Time",
                        tip: "Gain 1 additional action. Gain 5 fatigue."
                    }
                ]
            },
            {
                key: "therapist",
                label: "Therapist",
                levels: [
                    {
                        label: "Here to Listen",
                        tip: "You can give your Sanity to others during a short rest. Restore 5 Sanity on Long Rests."
                    },
                    {
                        label: "Emotional Intelligence",
                        tip: "When you give Sanity, give twice as much as you lose."
                    },
                    {
                        label: "Personal Conneciton",
                        tip: "Anyone you give Sanity to gains 2 Bonus Rolls until the next short rest. This can only be active on one person at a time."
                    }
                ]
            },
            {
                key: "brawler",
                label: "Brawler",
                levels: [
                    {
                        label: "Counterstrike",
                        tip: "Fully dodging a melee attack allows you to make a free attack back."
                    },
                    {
                        label: "Doublestrike",
                        tip: "Gain +2 bonus rolls to your attacks if you melee attack for all of your main actions."
                    },
                    {
                        label: "Dodgestrike",
                        tip: "Gain 1 free dodge success for every melee attack success after 5 successes."
                    }
                ]
            },
            {
                key: "lucky",
                label: "Lucky",
                levels: [
                    {
                        label: "Re-roll",
                        tip: "Three times per game session, you can re-roll a roll. You must accept the results of the second roll and you do not regain any resources back."
                    },
                    {
                        label: "Treasure Finder",
                        tip: "When you scavenge, roll a luck check. If the result is high enough, you can scavenge again."
                    },
                    {
                        label: "Dodging Death",
                        tip: "Whenever your health is reduced below 0 next, be reduced to 1 hp instead. If feasible, you will be placed away from any immediate danger. This can only occur once. You can use this effect on other players."
                    }
                ]
            },
            {
                key: "combatsense",
                label: "Combat Sense",
                levels: [
                    {
                        label: "Combat Sense",
                        tip: "You can use an action at the start of each combat round to sense the lowest health target."
                    },
                    {
                        label: "Attack Interpolation",
                        tip: "Your Combat Sense action can also sense enemy intents, such as their targets for ranged attacks."
                    },
                    {
                        label: "Tactician",
                        tip: "At the start of combat, you can re-assign initiative rolls between players."
                    }
                ]
            },
            {
                key: "martialartist",
                label: "Martial Artist",
                levels: [
                    {
                        label: "Disabling Strike",
                        tip: "Your unarmed attack can lower the results of any rolls your target makes this turn, based on number of successes. Does not stack."
                    },
                    {
                        label: "Weakening Strike",
                        tip: "Your unarmed attack on a target allows other targets to gain bonus rolls when attacking that same target this turn, based on number of successes. Does not stack."
                    },
                    {
                        label: "Lotus Strike",
                        tip: "Your unarmed attack on a target can stun the target, preventing any further actions this turn, based on number of successes."
                    }
                ]
            },
            {
                key: "leader",
                label: "Leader",
                levels: [
                    {
                        label: "Lead from the front",
                        tip: "Adjacent allies take reduced damage equal to your Charisma attribute but cannot reduce an attack's damage below 3."
                    },
                    {
                        label: "Inspire",
                        tip: "Once per combat, you can spend 5 sanity and 1 action to make all nearby/adjacent players have free rolls for a turn."
                    },
                    {
                        label: "Stick to the Plan",
                        tip: "At the start of combat, you can declare a plan of action. Players who sick to this plan of action gain +2 bonus rolls."
                    },
                ]
            },
            {
                key: "zmutationN",
                label: "N Mutation",
                levels: [
                    {
                        label: "N Mutation",
                        tip: "You cannot gain or level this ability through normal means. You are no longer quite human. There is no longer any limit on your Strength, Agility, and Perception attributes and they cost half XP to increase. Skills cost double XP to increase. Unarmed attacks deal damage equal to your Strength attribute."
                    },
                    {
                        label: "???",
                        tip: "????"
                    },
                    {
                        label: "???",
                        tip: "????"
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


/**
 * For use in API Scripts
 */
export class CharacterActor{
    constructor(id){
        this.id = id;
    }

    /**
     * Gets a full attribute object
     * @param {*} attrKey 
     * @returns attribute object
     */
    getAttr = function(attrKey){
        return findObjs({type: 'attribute', characterid: this.id, name: attrKey})[0];
    }

    /**
     * Wrapper around roll20's getAttrByName. 
     * Gets the value of an attribute but uses the field's default value if not present.
     * 
     * @param {string} attr name of the attribute
     * @param {boolean} getMax get Max value instead of current if set to true.
     * @returns 
     */
    getAttrVal = function(attrKey, getMax = false){
        return getAttrByName(this.id, attrKey, (getMax ? 'max' : 'current'));
    }

    // Note this one returns the full attribute object because we expect to make changes.
    get fatigue() {
        return this.getAttr(CharacterModel.resources.fatigue.key);
    }

    get bonusRolls() {
        return parseInt(this.getAttrVal(CharacterModel.bonusrolls.key), 10) || 0;
    }

    get fatigueCost(){
        return parseInt(this.getAttrVal(CharacterModel.rollcost.key), 10) || 0;
    }

    get rolltype(){
        return this.getAttrVal(CharacterModel.rolltype.key);
    }

    get energy(){
        return parseInt(this.getAttrVal(CharacterModel.resources.energy.key), 10) || 0;
    }


    addFatigue(){
        if (this.rolltype == 'free'){
            return false;
        }

        //Be mindful each getter actually calls the Roll20 API.
        let fatigueAttr = this.fatigue;
        let currFatigue = parseInt(fatigueAttr.get('current'), 10) || 0;
        let newFatigue = Math.max(currFatigue + this.fatigueCost, 0);

        fatigueAttr.setWithWorker({current: newFatigue});

        return this.fatigueCost;
    }

    rollAgainst(target, bonus=0){
        let fatigueAttr = this.fatigue;
        let fatiguePenalty = Math.max(parseInt((fatigueAttr.get('current') / 10), 10), 0),
            totalEnergy = parseInt(this.energy, 10),
            addedBonus = parseInt(bonus, 10) || 0;

        let totalPool = Math.max(totalEnergy - fatiguePenalty + addedBonus, 1);

        return generatePoolRollCommand(totalPool, target, this.bonusRolls);
    }
}