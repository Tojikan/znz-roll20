(function () {
    'use strict';

    /////// Library of Functions for Generic Use

    /**
     * Converts an object to array based on its keys.
     * @param {*} obj 
     * @returns 
     */
    function objToArray(obj) {
        return Object.keys(obj).map((x)=> obj[x]);
    }

    /**
     * Tokenizes chat inputs for API commands
     * 
     * Step 1 - Splits chat by space unless the space is within single or double quotes.                                    Example: !example with 'text line' "hello world" gets split to ["!example", "with", "text line" "hello world"]
     * Step 2 - Tokenize everything into a Struct using a '=' to denote an argument in the form of [arg]=[value].           Example: !example test="hello world" is {0:"!example" test: "hello world"}
     * Step 2a - Everything to left of '=' becomes the key and everything to the right becomes the value
     * Step 2b - If no '=', the value will be the array position
     * Step 3 - If no regex match for =, check for any flags in the form of --flag. Set this to true.                                          Example: --unarmed    
     * Return the struct
     * 
     * There should not be spaces between '=' and the arg/value
     * @param {string} input - text input
     * @returns an object where each key is the param name and the value is its tokenized param value.
     */
     function tokenizeArgs(input) {
        var result = {},
            argsRegex = /(.*)=(.*)/, //can't be global but shouldn't need it as we are splitting args. 
            quoteRegex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g; //Split on spaces unless space is within single or double quotes - https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli
            
        
            var quoteSplit = input.match(quoteRegex).map(e => {
                //https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
                let quote = /(["'])(?:(?=(\\?))\2.)*?\1/g.exec(e); //get either ' or ", whatever is first

                //if no quotes, will be null
                if (quote){
                    let re = new RegExp(quote[1], "g");
                    return e.replace(re, ''); //remove outer quotes
                } else {
                    return e;
                }
            });

            
        // This is our own code below for splitting along "="
        for (let i = 0; i < quoteSplit.length; i++){ 
            let match = argsRegex.exec(quoteSplit[i]); //Regex to match anything before/after '='. G1 is before and G2 is after

            if (match !== null) { //
                let value = match[2];
                
                //Convert types
                if ( !isNaN(value)){value = parseInt(match[2], 10);}
                if ( value === 'true'){value = true;}
                if ( value === 'false'){value = false;}

                result[match[1]] = value;
            } else if (quoteSplit[i].startsWith('--')) { //Handle Flags
                let flag = quoteSplit[i].substring(2);
                result[flag] = true;
            } else { //Default - array position
                result[i] = quoteSplit[i];
            }
        }
        return result;
    }

    /**
     * Use this in conjuction with outputDefaultTemplate or a string for a default template
     * @param {string} rollCommand 
     * @param {number} multiply Number to multiply by. Leave null to not add any
     * @param {string} multiplyLabel Label if you multiply. Defaults to Raw Damage.
     * @returns string
     */
    function generateRollResultText(rollCommand, multiply=null, multiplyLabel='Raw Damage'){
        let output = ' [[';

        output += `[[${rollCommand}]]`;

        if (multiply){
            output += `*[[${multiply}]]`;
        }

        output += ']] ';

        output += ' {{Roll=$[[0]] Successes!}} ';

        if (multiply){
            output += ` {{${multiplyLabel}=$[[0]] * $[[1]]==$[[2]] }} `;
        }

        return output;
    }

    /**
     * 
     * @param {*} amount - number of dice
     * @param {*} target - target to roll against
     * @param {*} amountmod - add dice to amount
     * @param {*} dice - diceface
     * @returns 
     */
    function generatePoolRollCommand(amount, target, amountmod = 0, dice=10){
        //assume any conversions on negative rolls get handled prior to this method
        let totalAmount = amount + amountmod;
        return `{${totalAmount}d${dice}}<${target}`
    }


    /**
     * 
     * @param {*} arr  {label, value} or string. strings appended directly.
     * @param {*} name 
     * @param {*} sender 
     */
    function outputDefaultTemplate(arr, name, sender){
        let output = `&{template:default} {{name=${name}}} `;

        for (let msg of arr){
            if (typeof msg === 'string'){
                output += ' ' + msg + ' ';
            } else {
                output += ` {{${msg.label}=${msg.value}}}`;
            }
        }

        sendChat(sender, output);
    }



    function setupScriptVars(msg){
        let sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
        let args = tokenizeArgs(msg.content);
        return {
            args: args,
            sender: sender,
            character: getCharacter(msg, args)
        };
    }


    /**
     * Gets a player's selected character from a msg or from passed in args. Only returns the character if the player controls the Character or is a GM
     * 
     * @param {*} msg 
     * @param {*} args 
     * @returns 
     */
     function getCharacter(msg, args = {}){
        let token,
            character = null;
        
        if ("selected" in msg){
            token = getObj('graphic', msg.selected[0]._id);

            if (token){
                character = getObj('character', token.get('represents'));
            }
        } else if ('characterid' in args){
            character = getObj('character', args['characterid']);
        }

        //Validate player controls token or is GM
        if (character){

            if (!playerIsGM(msg.playerid) && 
            !_.contains(character.get('controlledby').split(','), msg.playerid) &&
            !_.contains(character.get('controlledby').split(','),'all') && 
            msg.playerid !== 'API'){
                return null;
            }

        } else {
            return null;
        }

        return character;
    }

    const CharacterModel = {
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


    /**
     * For use in API Scripts
     */
    class CharacterActor{
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

    const watchedAttr = [
        ...objToArray(CharacterModel.resources).map(x => x.key),
        ...objToArray(CharacterModel.attributes).map(x => x.key),
        CharacterModel.equipmentslots.key,
        CharacterModel.inventoryslots.key,
    ];


    /**
     * @param {*} obj 
     * @param {*} prev 
     */
    function attrAlert(obj, prev){
        let attr;

        if (watchedAttr.includes(obj.get("name"))){
            attr = obj.get("name");
        } else {
            return;
        }

        let textColor = '#456C8B',
        bgColor = '#CCE8F4',
        prevVal = prev['current'], //prev is a basic object without getters/setters
        curVal = obj.get('current'),
        character = getObj('character', obj.get('_characterid'));

        if (prevVal == curVal){
            return;
        }

        sendChat(
            'Attribute Alert',
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')}'s ${attr} attribute was changed!</strong><div> <div>Previous Value:  ${prevVal}</div><div> New Value: ${curVal} .</div></div>`
        );

        if (curVal <= 0){
            textColor = '#8B0000';
            bgColor = '#FFA07A';
            sendChat(
                'Attribute Alert - Reached Zero!',
                `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} reached 0 ${attr} points!</strong></div>`
            );
        } 
    }

    function HandleAttrRoll(msg){
        if (msg.type !== "api" || !msg.content.startsWith('!!aroll')){
            return;
        }

        const {args, sender, character} = setupScriptVars(msg);
        const charActor = new CharacterActor(character.id);
        
        let attrVal;
        
        if (!args.attribute && args.attrKey){
            //if its a user supplied attribute, such as a variable skill.
            attrVal = charActor.getAttrVal(args.attrKey);
        } else if (args.attribute){
            attrVal = args.attribute;
        } else {
            throw('No attribute set!');
        }
        
        const title = `${character.get('name')} makes a ${args.title} roll!`;
        const results = [];

        const rollCommand = charActor.rollAgainst(attrVal, args.bonus);
        results.push(generateRollResultText(rollCommand));

        let fatigueAdded = charActor.addFatigue();
        if (fatigueAdded){
            results.push({label:'Gained Fatigue', value:fatigueAdded});
        }
        outputDefaultTemplate(results, title, sender);
    }

    function HandleReload(msg) {
        if (msg.type !== "api" || !msg.content.startsWith('!!reload')){
            return;
        }

        const {args, sender, character} = setupScriptVars(msg);
        
        let result = [];
        let charActor = new CharacterActor(character.id);
        
        let resultTitle = `${character.get('name')} attempts to reload their ${args.weaponname}!`;

        let ammoField = charActor.getAttr(args.ammo),
            durabilityField = charActor.getAttr(args.durability),
            ammoStoreField = charActor.getAttr(args.type);

            console.log();

        let ammo = parseInt(ammoField.get('current'), 10) || 0,
            ammoMax = parseInt(ammoField.get('max'), 10) || 0,
            ammoStore = parseInt(ammoStoreField.get('current'), 10) || 0,
            durability = parseInt(durabilityField.get('current'), 10) || 0;
            
        // get diff between max and curr, but limit it to size of store.
        // factors in scenarios if max < curr 
        const calculateAmmo = function (curr, max, store){
            return Math.min( Math.max(max - curr, 0), store);
        };

        let ammoToAdd = calculateAmmo(ammo, ammoMax, ammoStore);

        if (ammoToAdd == 0){
            //already full
            return;
        }

        if (ammoStore <= 0){
            result.push({label: 'Failed to Reload', value:`${character.get('name')} has 0 ammo!`});

            outputDefaultTemplate(result, resultTitle, sender);
            return;
        }


        ammoField.setWithWorker({current: ammo + ammoToAdd});
        ammoStoreField.setWithWorker({current: ammoStore - ammoToAdd});
        durabilityField.setWithWorker({current: Math.max(durability - 1, 0)});

        result.push({label: 'Success', value:`${character.get('name')} reloads!`});

        if (durability - 1 <= 0){
            result.push({label: 'Weapon Broken!', value: `${args.weaponname} is Broken!`});
        }

        outputDefaultTemplate(result, resultTitle, sender);
    }

    var Main = Main || (function(){
        const handlers = [
            {name:"Reload Script", fn:HandleReload},
            {name:"Attr Roll Script", fn:HandleAttrRoll}
        ];
        const watchers = [
            {name:"AttrWatch", fn:attrAlert}
        ];

        const HandleInput = function(msg){
            if (msg.type !== "api"){
                return;
            }

            for (let handle of handlers) {
                try {
                    handle.fn(msg);
                } catch(err){
                    log(err);
                    log(err.stack);
                    sendMessage(err, `Error in ${handle.name}`, 'error');
                }
            }
        };

        const HandleAttributeChange = function(obj, prev){
            for (let watcher of watchers){
                try {
                    watcher.fn(obj, prev);
                } catch(err){
                    log(err);
                    log(err.stack);
                    sendMessage(err, `Error in ${watcher.name}`, 'error');
                }
            }
        };

        /**
         * Post a formatted text to chat.
         * @param {*} msg 
         * @param {*} who 
         * @param {*} type 
         * @returns 
         */   
        const sendMessage = function(msg, who, type){
            let textColor = '#000',
                bgColor = '#fff';

            switch (type){
                case "error":
                    textColor = '#C14054';
                    bgColor = '#EBC8C4';
                    break;
                case "info":
                    bgColor = '#CCE8F4';
                    textColor = '#456C8B';
                    break;
                case "warning":
                    bgColor = '#F8F3D6';
                    textColor = '#8B702D';
                    break;
                case "success":
                    bgColor = '#baedc3';
                    textColor = '#135314';
                    break;
                case "header":
                    sendChat(
                        `${who}`,
                        `<h3 style="border: solid 1px black; background-color: white; padding: 5px;">${msg}</h3>`
                    );             
                    return;
            }

            sendChat(
                `${who}`,
                `<div style="padding:3px; border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 120%;">${msg}</div>`
            );
        };


        const init = function() {
            on('chat:message', HandleInput);
            on('change:attribute', HandleAttributeChange);
    	};

        return {
            init: init,
        }
    })();

    on("ready", function(){
        Main.init();
    });

})();
