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
     * Capitalize first char of string.
     * @param {*} str 
     * @returns 
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
        const result = {};
        
        //First bit of regex: splits among spaces, unless a space is wrapped in `'" 
        const quoteRegex = /(?:[^\s"'`]+|"[^"]*"|'[^']*'|`[^`]*`)+/g; //adapted from https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli
        var quoteSplit = input.match(quoteRegex).map(e => {
            //https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
            let quote = /([`"'])(?:(?=(\\?))\2.)*?\1/g.exec(e); //get either ' or ", whatever is first
            
            //if no quotes, will be null
            if (quote){
                let re = new RegExp(quote[1], "g");
                return e.replace(re, ''); //remove outer quotes
            } else {
                return e;
            }
        });
        
        //For each of the splits from above, we can then split among "=" to get our key-value pairs.
        //Since it's already split we don't have to worry about globals.
        const argsRegex = /(.*?)=(.*)/; //Non-greedy first capture group so that future = signs don't mess this up. 
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
            level: {key:'abilitylevel', label: 'Level'}
        },
        flaws: {
            count: 3,
            selected: {key: 'flaw'}
        },
    };

    //"Item" is a reserved key because it's used in pickup, so don't use it as a key here.
    const ItemModel = {
        name:{key:"name"},
        type:{key:"type"},
        category: {key: "category"},
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

            let totalPool = Math.max(energy + bonusDice - fatiguePenalty);
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

    const meleeWeapons = {
        knife: {
            name: "Knife",
            type: "melee",
            category: "Knife",
            quantity: 1,
            melee: 6,
            ranged: 6,
            block: 2,
            durability: 4,
            variations: {
                uncommon: {
                    name: "Hunting Knife",
                    melee: 7,
                    ranged: 7,
                    durability: 8,
                },
                rare: {
                    name: "Bowie Knife",
                    melee: 10,
                    ranged: 10,
                    durability: 12,
                    block: 3,
                },
                epic: {
                    name: "Ka-Bar",
                    melee: 12,
                    ranged: 12,
                    durability: 16,
                    block: 5,
                },
                legendary: {
                    name: "WASP Injection Knife",
                    melee: 30,
                    durability: 10,
                }
            }
        },

        club: {
            name: "Club",
            type: "melee",
            category: 'Club',
            quantity: 1,
            melee: 3,
            ranged: 3,
            block: 3,
            durability: 8,
            variations: {
                uncommon: {
                    name: "Baseball Bat",
                    melee: 5,
                    durability: 15,
                    block: 5,
                },
                rare: {
                    name: "Baton",
                    melee: 8,
                    durability: 25,
                    block: 8,
                },
                epic: {
                    name: "Morning Star",
                    melee: 12,
                    durability: 40,
                    block: 10,
                },
                legendary: {
                    name: "Kanabo",
                    melee: 18,
                    ranged: 5,
                    durability: 60,
                    block: 15
                }
            }
        }
    };

    //TODO: alias
    const miscItems = {
        food: {
            name: "Snacks",
            type: "misc",
            category: 'Food',
            quantity: 3,
            description: "Remove 3 fatigue",
            variations: {
                uncommon: {
                    name: "Meal",
                    quantity: 1,
                    description: "Remove 10 fatigue"
                },
                rare: {
                    name: "Junk Food",
                    quantity: 1,
                    description: "Remove 5 fatigue. Regain 5 Sanity."
                },
                epic: {
                    name: "Meal",
                    quantity: 1,
                    description: "Remove 10 fatigue"
                }
            }
        }
    };

    class ItemTemplate {
        constructor(template){
            this.stats = template;
            this.variations = template.variations;

            delete this.stats.variations;
        }


        getItem(variation=''){
            let itm = {
                ...this.stats
            };

            let category = ('category' in itm) ? itm.category : 'Item';


            if (variation && variation in this.variations){
                itm = {
                    ...itm,
                    ...this.variations[variation],
                };

                category = capitalize(variation) + ' ' + category;
            } else {
                category = 'Common ' + category;
            }

            itm.category = category;
            return itm;
        }
    }

    const templates = {
        ...meleeWeapons,
        ...miscItems
    };

    for (let key in templates){
        //setup new item template class which handles rarity and storing item stats.
        templates[key] = new ItemTemplate(templates[key]);
    }


    function HandlePickup(msg){
        if (msg.type !== "api" || !msg.content.startsWith('!!pickup')){
            return;
        }

        const {args, sender, character} = setupScriptVars(msg),
            charActor = new CharacterActor(character.id);

        let item = {};

        log("Executing pickup with following args:");
        log(args);
        //if pulling from template, we can pull a variation.
        let rarity = ("rarity" in args) ? args.rarity : '';
        
        //pull fields from template if a template is specified with item key or as a pure arg
        if ("item" in args || "1" in args){

            let itemKey = ("item" in args) ? args['item'] : args['1'];

            if (itemKey in templates){
                item = templates[itemKey].getItem(rarity);
            }
        }

        //add any new props to the item
        for (let key in args){
            //only allow itemmodel fields when building the item
            if (key in ItemModel){
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

    class Deck {
        constructor(arr=[]){
            this.deck = arr;
        }
        
        addCard(card, random=true){
            
            // If a card is an object. You can give it a count property to add multiple cards.
            // in that case, it'll need a card property which is the value of the card.
            let count = card.hasOwnProperty('count') ? card.count : 1,
                cardVal = card.hasOwnProperty('card') ? card.card : card;

            //Only allow strings?
            //TODO - if other types may be needed, evaluate
            if (typeof cardVal !== 'string'){
                return;
            }

            
            //use loop so we can add duplicates of a card.
            for (let i = 0; i < count; i++){
                if (random){
                    let i = Math.floor(Math.random() * this.deck.length);
                    this.deck.splice(i, 0, cardVal);
                } else {
                    this.deck.push(cardVal);
                }
            }
        }

        drawCard(){
            return this.deck.pop();
        }

        removeCard(card){
            for (let i = this.deck.length - 1; i >= 0; i--){
                if (this.deck[i] == card){
                    this.deck.splice(i, 1);
                }
            }
        }

        shuffleDeck(){
            for (let i = this.deck.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                let temp = this.deck[i];

                this.deck[i] = this.deck[j];
                this.deck[j] = temp;
            }
        }

        setDeck(deck){
            this.clearDeck();
            for (let card of deck){
                this.addCard(card, false);
            }
            this.shuffleDeck();
        }

        clearDeck(){
            this.deck = [];
        }

        getDeck(){
            return this.deck;
        }

        getLength(){
            return this.deck.length;
        }
    }

    const LootDeck = function(){
        const deck = new Deck();

        const setup = setupScriptVars;

        const handleResponse = function(response, sender, character){
            
            if (response){
                let msg = '',
                pickup = '';

                if ('info' in response){
                    msg += `&{template:default} {{name=Loot Deck Info}} `;
                    msg += ` {{Info=${response.info}}}`;
                }

                else if ('error' in response){
                    msg += `&{template:default} {{name=Error in Loot Deck!}} `;
                    msg += ` {{Error=${response.error}}}`;
                }
                

                else if ('card' in response || 'fail' in response){
                    msg += `&{template:default} {{name=${character.get('name')} attempts to scavenge for an item!}} `;

                    if ('fail' in response){
                        msg += ` {{Result=${response.fail}}}`;
                    } 

                    if ('card' in response){    
                        pickup = response.card;

                    }
                }  
                
                if (msg.length){
                    sendChat(sender, msg);
                }
                
                //We can just let the pickup script handle the rest. We just have to make sure all decks are written in a way that will work with pickup.
                if (pickup.length){
                    sendChat(sender, `!!pickup ${pickup} characterid='${character.get('id')}'`);
                }
            }
        };


        const handleDeck = function(msg){
            if (msg.type !== "api" || !msg.content.startsWith('!!deck')){
                return;
            }
            
            const {args, sender, character} = setup(msg),
            retVal = {};

            //make it easier to setup args.
            let shortArg = ('1' in args ? args['1'] : '');

            // Don't support multiple args, so uses a else if
            
            //Clear deck. Don't use shorthand here for safety.
            if ("clear" in args && args['clear'] == true){
                log('Loot Deck Reset!');
                deck.clearDeck();
                log(deck.getDeck());
            
            // Shuffle the deck
            } else if ("shuffle" in args || shortArg == 'shuffled'){
                log('Loot Deck Shuffled!');
                deck.shuffleDeck();
                log(deck.getDeck());
                retVal.info = "The Loot Deck was shuffled!";
            }

            // Draw a card.
            else if ("draw" in args || shortArg == 'draw'){
                let card = deck.drawCard();
                
                if (!card){ 
                    log('Attempted to draw, but Loot Deck was empty');
                    retVal.fail = "The Loot Deck is empty!";
                } else {
                    log(`Attempted to draw a ${card} from the Loot Deck!`);
                    retVal.card = card;
                }
            }

            //Set a deck from some json. this needs an arg.
            else if ("set" in args){
                try {
                    log('Attempting to set deck with:');
                    log(args['set']);
                    let json = JSON.parse(args['set']);

                    if (!Array.isArray(json)){
                        log('Invalid value when setting loot deck!');
                        retVal.error = "Invalid type when setting Loot Deck!";
                    }

                    deck.setDeck(json);
                    deck.shuffleDeck();
                    log("Set Loot Deck with " + deck.getLength() + ' cards!');
                    log(deck.getDeck());
                    retVal.info = "The Loot Deck was set with new cards!";
                } catch(e){
                    log(e.message);
                    retVal.error = "Unknown error setting loot deck!";
                    log('Error');
                }
            }

            // Add a card to the deck
            else if ("add" in args && args['add'].length){
                let toAdd = args['add'];

                //In case we want to add json array, try to parse it first.
                try {
                    let json = JSON.parse(toAdd);
                    toAdd = json;
                } catch(e){}

                log(`Added card(s) '${args['add']}' to deck!`); // log raw text
                deck.addCard(toAdd);
            }

            // Remove a card from the deck
            else if ("remove" in args && args['remove'].length){
                log(`Removed card '${args['remove']}' from deck!`);
                deck.removeCard(args['remove']);
            }

            // Display deck length. Log deck to console.
            else if ("info" in args || shortArg == 'info'){
                log('Getting deck info!');
                retVal.info = `Deck has ${deck.getDeck().length} cards remaining!`;
                log(deck.getDeck());
                log(deck.getLength());
            }
            

            handleResponse(retVal, sender, character);
            return retVal;
        };
        
        return {
            handleDeck: handleDeck
        };
    };

    var Main = Main || (function(){

        const lootDeck = LootDeck(); //Deck gets initiated in function

        const handlers = [
            {name:"Reload Script", fn:HandleReload},
            {name:"Attribute Roll Script", fn:HandleAttrRoll},
            {name:"Attack Roll Script", fn:HandleAttack},
            {name:"Pickup Script", fn:HandlePickup},
            {name:"Loot Deck Script", fn:lootDeck.handleDeck}, // This one is a closure.
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
