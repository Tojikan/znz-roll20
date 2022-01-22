(function () {
    'use strict';

    /////// Library of Functions for Generic Use


    /**
     * Prepends/Appends a prefix/suffix to a field key.
     * @param {*} prefix 
     * @param {*} field 
     * @param {*} suffix 
     * @returns 
     */
    function affixKey(prefix, field, suffix){
        let fld = {...field};

        const isSet = (x) => x == null || x == undefined;

        fld.key = (!isSet(prefix) ? prefix + '_' : '') + fld.key + (!isSet(suffix) ? '_' + suffix : '');

        return fld;
    }

    /**
     * Converts an object to array based on its keys.
     * @param {*} obj 
     * @returns 
     */
    function objToArray(obj) {
        return Object.keys(obj).map((x)=> obj[x]);
    }

    /**
     * Calls a function on each key-value of an object
     * @param {*} obj 
     * @param {*} callback 
     * @returns 
     */
    function objMap(obj, callback){
        let o = {...obj};
        
        for (let key of Object.keys(obj)){
            o[key] = callback(obj[key]);
        }
        return o;
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
    function generatePoolRollText(amount, target, dice=10){
        //assume any conversions on negative rolls get handled prior to this method
        return `{${amount}d${dice}}<${target}`
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
        let character = getCharacter(msg, args);

        if (!character){
            throw('No Character was selected or specified!');
        }

        return {
            args: args,
            sender: sender,
            character: character,
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



    /**
     * Extract array of repeater IDs from character attributes
     * @param {*} repeaterId 
     * @returns 
     */
     const getRepeaterIds = function(repeaterId, characterId){
        let result = [];

        let attributes = findObjs({type:'attribute', characterid:characterId});

        const regexGetRowId = function(str){
            return str.match(/(?<=_)-(.*?)(?=_)/);
        };

        attributes.map((attr)=>{
            if (attr.get('name').startsWith(`repeating_${repeaterId}_`)){
                let row = regexGetRowId(attr.get('name'));

                if (row){
                    if (!result.includes(row[0])){
                        result.push(row[0]);
                    }
                }
            }
        });

        return result;
    };


    /**
     * API Script version for this since this is a sheetworker only function on R20.
     * @returns a new row ID for a repeater row.
     */
    const generateRowID = function () {

        /**
         * Generates a UUID for a repeater section, just how Roll20 does it in the character sheet.
         * https://app.roll20.net/forum/post/3025111/api-and-repeating-sections-on-character-sheets/?pageforid=3037403#post-3037403
        */
        const generateUUID = function() { 

            var a = 0, b = [];
            return (function() {
                var c = (new Date()).getTime() + 0, d = c === a;
                a = c;
                for (var e = new Array(8), f = 7; 0 <= f; f--) {
                    e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                    c = Math.floor(c / 64);
                }
                c = e.join("");
                if (d) {
                    for (f = 11; 0 <= f && 63 === b[f]; f--) {
                        b[f] = 0;
                    }
                    b[f]++;
                } else {
                    for (f = 0; 12 > f; f++) {
                        b[f] = Math.floor(64 * Math.random());
                    }
                }
                for (f = 0; 12 > f; f++){
                    c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
                }
                return c;
            })();
        };

        return generateUUID().replace(/_/g, "Z");
    };

    /**
     * Base class for an Actor. We just need a character ID.
     */
    class Actor{
        constructor(characterId, fields){
            this.characterId = characterId;
            this.fields = fields;


            /**
             * Proxy for getting/setting character attribute. The proxy will call the Roll20 API
             * in order to get/set an attribute
             */
            const dataProxy = {
                get: function(target, key){ 
                    let val = this.getAttrVal(target[key].key);
                    return ( Number(val, 10) || val);
                }.bind(this),
                set: function(target, key, value){
                    return this.setAttrVal(target[key].key, value);
                }.bind(this),
            };
            
            /**
             * Proxy for retrieving the full character attribute.
             */
            const attrProxy = {
                get: function(target, key){
                    return this.getAttr(target[key].key);
                }.bind(this)
            };


            /**
             * Remember these proxies make API calls...So best to cache the results as much as possible
             */
            this.data = new Proxy(this.fields, dataProxy);
            this.attrs = new Proxy(this.fields, attrProxy);
        }


        /**
         * Gets a full attribute object
         * @param {*} attrKey 
         * @returns attribute object
         */
        getAttr(attrKey){
            return findObjs({type: 'attribute', characterid: this.characterId, name: attrKey})[0];
        }
        
        /**
         * Gets the value of an attribute but uses the field's default value if not present.
         * @param {string} attr name of the attribute
         * @param {boolean} getMax get Max value instead of current if set to true.
         * @returns 
         */
        getAttrVal(attrKey, getMax = false){
            return getAttrByName(this.characterId, attrKey, (getMax ? 'max' : 'current'));
        }


        /**
         * Set Value of an attribute
         * 
         * @param {string} attr attribute name
         * @param {*} value value to set to
         */
        setAttrVal(attr, value){
            let attribute = this.getAttr(attr);

            if (!attribute){
                return null;
            }

            let prev = attribute.get('current');
            attribute.setWithWorker({current: value});

            return {
                prev: prev,
                value: value
            }
        }
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
                            tip: "At the start of combat, you can declare a specific plan of action. Players who stick to this plan of action gain +2 bonus rolls."
                        },
                    ]
                },
                {
                    key: "resources",
                    label: "Conservationist",
                    levels: [
                        {
                            label: "Power Naps",
                            tip: "Once per session, you can restore resources during a short rest as if it was a long rest (2x effect on food and healing)."
                        },
                        {
                            label: "Proper Maintenance",
                            tip: "Once per session, you can increase the durability and max durability of an item by 5. This can only happen to 1 item at a time."
                        },
                        {
                            label: "Efficient Actions",
                            tip: "Reduce your base Fatigue Cost by 1."
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
                    tip: "Bonus Rolls will always be set to -4 (regardless of other bonuses) in low-light/dark environments.",
                },
                {
                    label: "Nearsighted",
                    key: "nearsighted",
                    tip: "You wear glasses. Bonus rolls are set to -6 (regardless of other bonuses) when your glasses are off.",
                },
                {
                    label: "Sick",
                    key: "sickly",
                    tip: "You must take special medicine every day or else reduce your current health by 50%, minimum of 10. Start the game with 3 special medicine.",
                },
                {
                    label: "Easily Tired",
                    key: "weakly",
                    tip: "Set your Fatigue Cost to 4.",
                },
                {
                    label: "Disastrous",
                    key: 'unlucky',
                    tip: 'Bad things seem to happen around you.',
                },
                {
                    label: "Clumsy",
                    key: 'clumsy',
                    tip: 'Your character occasionally trips or knocks things over.',
                },
                {
                    label: "Unlikeable",
                    key: 'unlikeable',
                    tip: 'For some reason, other NPCs are averse to working with or helping you.',
                },
                {
                    label: "Weak",
                    key: 'incompetent',
                    tip: 'Set your bonus rolls to -1 as a base number.',
                },
                {
                    label: "Frail",
                    key: 'frail',
                    tip: 'Whenever you take damage, you have a chance to take additional damage. ',
                },
                {
                    label: "Panicky",
                    key: 'panicky',
                    tip: 'You easily panick. Whenever your initiative is 6 or less or on failing certain Willpower rolls, your character will either B) Fight suicidally,  B) Flight without regards to anything, or C) Freeze up',
                },
                {
                    label: "Glutton",
                    key: "glutton",
                    tip: "Food restores 3 less fatigue than normal, up to half of the normal effect.",
                },
                {
                    label: "Alcoholic",
                    key: "alcoholic",
                    tip: "You do not gain any benefits from long rests (such as double effects on food and restoration items) unless you drink at least 2 alcohols. Alcohol no longer restores Sanity.",
                },
                {
                    label: "Allergic",
                    key: "allergic",
                    tip: "You are deathly allergic to 3 fairly common things. Take health damage if you are close to these things. Eating them can cause death if you do not have an Epipen.",
                },
            ]
        },
    };

    //"Item" is a reserved key because it's used in pickup, so don't use it as a key here.
    const ItemModel = {
        name:{key:"name"},
        type:{key:"type"},
        description: {key:"description"},
        quantity:{key:"quantity"},
        melee:{key:"melee"},
        ranged:{key:"ranged"},
        block:{key:"block"},
        durability:{key:"durability", max:true},
        ammo:{key:"ammo", max:true},
        ammotype:{key:"ammotype", select: true},
    };

    // Permitted fields - you should just add fields that will be used in the API.
    const fields = {
        ...CharacterModel.attributes,
        ...CharacterModel.combatskills,
        ...CharacterModel.resources,
        ...CharacterModel.ammo.list,
        bonusrolls: CharacterModel.bonusrolls,
        rollcost: CharacterModel.rollcost,
        rolltype: CharacterModel.rolltype,
        inventoryslots: CharacterModel.inventoryslots,
        inventory: CharacterModel.inventory, //do not try to get this, just need the key in the fields object for pickup
    };

    // Remember that get() in this.data and this.attrs calls the Roll20 API so try to cache into a variable if you can.

    /**
     * Actor Object for interfacing with Character Attributes in an API Script.
     * Pass it a characterId and you should be able to access allowed attributes through this.data or this.attrs
     */
    class CharacterActor extends Actor {
        constructor(characterId){
            super(characterId, fields);
        }

        /**
         * Does a pool roll against a target.
         * @param {*} target Target for roll
         * @param {*} bonus Add bonus to target.
         * @returns 
         */
        roll(target, bonus){
            let fatiguePenalty = parseInt(this.data.fatigue / 10, 10),
                energy = parseInt(this.data.energy, 10),
                bonusDice = parseInt(this.data.bonusrolls, 10);

            let totalPool = Math.max(energy + bonusDice + parseInt(bonus, 10) - fatiguePenalty);
            let rollTarget = target + parseInt(bonus, 10);

            return generatePoolRollText(totalPool, rollTarget);
        }

        /**
         * Adds fatigue equal to rollcost.
         * @returns false if free roll cost, else returns roll cost
         */
        addFatigue(){
            if (this.data.rolltype == 'free') {
                return false;
            }

            let fatAttr = this.attrs.fatigue;
            let rollCost = this.data.rollcost;
            let currFat = parseInt(fatAttr.get('current'), 10) || 0;
            let newFat = Math.max(currFat + rollCost, 0);

            fatAttr.setWithWorker({current: newFat});

            return rollCost;
        }

        /**
         * Adds item 
         * @param {*} itemObj object where each key is the item field and value is the value to be set.
         */
        addItem(itemObj){
            const rowId = generateRowID();
            const validKeys = objToArray(ItemModel).map(x => x.key);
            let success = 0;

            for (let key in itemObj){
                //Don't handle max fields directly - max needs to be set as a property of an attribute
                if (!validKeys.includes(key) || key.endsWith('_max')){
                    continue;
                }

                let baseField = ItemModel[key];

                const newAttr = {};
                newAttr.name = `repeating_${fields.inventory.key}_${rowId}_${baseField.key}`;
                newAttr.current = Number(itemObj[key], 10) || itemObj[key];
                newAttr.characterid = this.characterId;

                if (baseField.max){
                    if (itemObj.hasOwnProperty(key + '_max')){
                        newAttr.max = (Number(itemObj[key + '_max'], 10) || itemObj[key + '_max'] ) || newAttr.current;
                    } else {
                        newAttr.max = newAttr.current;
                    }
                }

                if (newAttr.current){
                    createObj("attribute", newAttr);
                    success++;
                }
            }

            return success;
        }
    }

    // Remember that get() in this.data and this.attrs calls the Roll20 API so try to cache into a variable if you can.
    class ItemActor extends Actor {
        constructor(characterId, itemId){
            let itemFields = ( itemId ) ? objMap(ItemModel,(x) => affixKey(itemId, x, null)) : ItemModel;

            super(characterId, itemFields);
            this.itemId = itemId;
        }


        spendAmmo(){ return this.spendResource(this.attrs.ammo)}
        spendDurability(){ return this.spendResource(this.attrs.durability)}
        spendQuantity(){ return this.spendResource(this.attrs.quantity)}
        
        /**
         * Spend 1 of an attribute
         * @param {*} attribute full attribute
         * @returns 1 if success, 0 if success but causes attr to be 0, -1 if failed.
         */
        spendResource(attribute){
            let val = attribute.get('current');
            
            //returns negative if nothing could be spent.
            if ( val <= 0){
                return -1;
            }
            
            attribute.setWithWorker({current: val - 1});
            
            //Check if this spend causes attribute to be 0.
            return (val - 1) <= 0 ? 0 : 1;
        }
    }

    const HandleAttack = msg => (function(msg){
        if (msg.type !== "api" || !msg.content.startsWith('!!attack')){
            return;
        }

        const {args, sender, character} = setupScriptVars(msg),
            itemActor = new ItemActor(character.id, args.itemId),
            charActor = new CharacterActor(character.id),
            title = `${args.charName} attempts to ${args.actionName}!`,
            itemName = `${args.charName}'s ${args.itemName}`,
            result = [{label: 'Equipment', value: args.itemName}];


        //#region Actions
            const CheckDurability = function(){
                if (itemActor.data.durability <= 0){
                    result.push({label: "Attack failed!", value: `${itemName} is broken!`});
                    return false;
                }
                
                return true;
            };

            const GenerateRollResult = function( attribute, skill, multiplier, multiplyLabel){
                const rollCommand = charActor.roll(attribute, skill);
                return generateRollResultText(rollCommand, multiplier, multiplyLabel);
            };

            const RangedAttack = function(){
                const ammoSpent = itemActor.spendAmmo();

                if (ammoSpent == -1){
                    result.push({label: "Attack failed!", value: `${itemName} is out of ammo!`});
                    return;
                }
                
                result.push(GenerateRollResult(charActor.data.agility, charActor.data.ranged, itemActor.data.ranged, 'Ranged Damage'));
                
                if (ammoSpent == 0){
                    result.push({label: "Warning", value: `${itemName} has ran out of ammo!`});
                }
            };

            const MeleeAttack = function(){
                const durSpent = itemActor.spendDurability();
                //we already do broke check up top, so we can assume the attack goes through

                result.push(GenerateRollResult(charActor.data.strength, charActor.data.melee, itemActor.data.melee, 'Melee Damage'));

                if (durSpent == 0) {
                    result.push({label: "Warning", value: `${itemName} breaks and can no longer be used!`});
                }
            };

            const BlockAction = function(){
                const durSpent = itemActor.spendDurability();
                //we already do broke check up top, so we can assume the attack goes through

                result.push(GenerateRollResult(charActor.data.strength, charActor.data.block, itemActor.data.block, 'Damage Blocked'));

                if (durSpent == 0) {
                    result.push({label: "Warning", value: `${itemName} breaks and can no longer be used!`});
                }
            };

            const ThrowAction = function(){
                const quantSpent = itemActor.spendQuantity();

                if (quantSpent == -1){
                    result.push({label: "Attack failed!", value: `${args.charName} is out of ${args.itemName}!`});
                    return;
                }

                result.push(GenerateRollResult(charActor.data.strength, charActor.data.throwing, itemActor.data.ranged, 'Throw Damage'));

                if (quantSpent == 0){
                    result.push({label: "Warning", value: `${args.charName} is now out of ${args.itemName}!`});
                }
            };
            
            const MeleeThrow = function(){
                const durSpent = itemActor.spendDurability();

                result.push(GenerateRollResult(charActor.data.strength, charActor.data.throwing, itemActor.data.ranged, 'Throw Damage'));
                
                if (durSpent == 0){
                    result.push({label: "Warning", value: `${itemName} breaks upon being thrown!`});
                }
            };

        //#endregion

        let check;

        switch(args.action) {
            case 'meleeattack':
                check = CheckDurability();
                if (check) MeleeAttack();
                break;
            case 'rangedattack':
                check = CheckDurability();
                if (check) RangedAttack();
                break;
            case 'blockaction':
                check = CheckDurability();
                if (check) BlockAction();
                break;
            case 'throwaction':
                if (check) ThrowAction();
                break;
            case 'meleethrow':
                check = CheckDurability();
                if (check) MeleeThrow();
                break;
            default: 
                throw('Unknown action type!');
        }
        
        charActor.addFatigue();
        outputDefaultTemplate(result, title, sender);
        
    })(msg);

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

        const {args, sender, character} = setupScriptVars(msg),
            charActor = new CharacterActor(character.id),
            title = `${character.get('name')} makes a ${args.title} roll!`,
            results = [];

        const rollCommand = charActor.roll(charActor.data[args.attribute], args.bonus);
        results.push(generateRollResultText(rollCommand));

        let fatigueAdded = charActor.addFatigue();
        if (fatigueAdded){
            results.push({label:'Gained Fatigue', value: fatigueAdded});
        }
        outputDefaultTemplate(results, title, sender);
    }

    //TODO templates
    const templates = {};

    function HandlePickup(msg){
        if (msg.type !== "api" || !msg.content.startsWith('!!pickup')){
            return;
        }

        const {args, sender, character} = setupScriptVars(msg),
            charActor = new CharacterActor(character.id);

        let item = {};

        if ("item" in args && args.item in templates){
            item = templates[args.item];
        }

        //add any new props
        for (let key in args){
            //ITEM IS A RESERVED ARG AND SHOULD NOT BE USED AS A ITEMMODEL FIELD.
            if (key !== 'item'){
                item[key] = args[key];
            }
        }

        const result = [],
            itemName = item['name'] || "Item",
            title = `${character.get('name')} tries to pick up a(n) ${itemName}!`;

        
        if (!Object.keys(item).length){
            result.push({label: 'Error!', value: `Empty or Invalid Item!`});
            outputDefaultTemplate(result, title, sender);
            return;
        }
            
        const slots = charActor.data.inventoryslots,
            allIds = getRepeaterIds(charActor.fields.inventory.key, charActor.characterId);

        if (allIds.length >= slots){
            result.push({label: 'Inventory Full!', value: `${character.get('name')} has no more inventory slots!`});
            outputDefaultTemplate(result, title, sender);
            return;
        }      
        
        let pickedUp = charActor.addItem(item); //returns how many valid fields were added.

        if (pickedUp > 0){
            result.push({label:'Success!', value: `${character.get('name')} picked up a(n) ${itemName}`});
            result.push({label:'Valid Fields Added', value: pickedUp});
        } else {
            result.push({label:'Invalid Item!', value: `No fields were added. Did you use correct format?`});
        }

        outputDefaultTemplate(result, title, sender);
    }

    function HandleReload(msg) {
        if (msg.type !== "api" || !msg.content.startsWith('!!reload')){
            return;
        }

        const {args, sender, character} = setupScriptVars(msg);
        
        const charActor = new CharacterActor(character.id),
            itemActor = new ItemActor( character.id, args.item),
            resultTitle = `${character.get('name')} attempts to reload their ${args.weaponname}!`,
            result = [];

        //to reduce requests to r20 api, we just get the attr and compute from there rather than use the proxy setter.
        const ammoAttr = itemActor.attrs.ammo,
            ammoStoreAttr = charActor.attrs[args.type];

        const ammo = parseInt(ammoAttr.get('current'), 10) || 0,
            ammoMax = parseInt(ammoAttr.get('max'), 10) || 0,
            ammoStore = parseInt(ammoStoreAttr.get('current'), 10) || 0;
            
            
        if (ammoStore <= 0){
            result.push({label: 'Failed to Reload', value:`${character.get('name')} has 0 ammo to reload with!`});
            outputDefaultTemplate(result, resultTitle, sender);
            return;
        }
        
        // get diff between max and curr, but limit it to size of store.
        // factors in scenarios if max < curr 
        let ammoToAdd = Math.min( Math.max(ammoMax - ammo, 0), ammoStore);
            
        if (ammoToAdd == 0){
            //already full
            result.push({label: 'Reload Failed!', value: `${args.weaponname} is already full on ammo!`});
            outputDefaultTemplate(result, resultTitle, sender);
            return;
        } else {
            ammoAttr.setWithWorker({current: ammo + ammoToAdd});
            ammoStoreAttr.setWithWorker({current: ammoStore - ammoToAdd});
            result.push({label: 'Success', value:`${character.get('name')} reloads!`});
        }
        
        
        outputDefaultTemplate(result, resultTitle, sender);
    }

    var Main = Main || (function(){
        const handlers = [
            {name:"Reload Script", fn:HandleReload},
            {name:"Attribute Roll Script", fn:HandleAttrRoll},
            {name:"Attack Roll Script", fn:HandleAttack},
            {name:"Pickup Script", fn:HandlePickup},
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
