(function () {
    'use strict';

    var abc = {
    	id: "selectability",
    	label: "Select an Ability",
    	description: ""
    };
    var parkour = {
    	id: "Speedster",
    	description: "You can move 3 spaces at no cost on your turn."
    };
    var brawler = {
    	id: "brawler",
    	description: "Any excess guard is dealt as damage."
    };
    var cheerleader = {
    	id: "cheerleader",
    	description: "Reduce difficulty of roll for adjacent allies by 1 level."
    };
    var builder = {
    	id: "builder",
    	description: "Create a distraction device by spending 1 AP and 1 Item. The device will attract common zombies towards it for some time."
    };
    var scavenger = {
    	id: "scavenger",
    	description: "Draw 1 additional cards when you scavenge. If you are scavenging a location alone, draw 3."
    };
    var sniper = {
    	id: "sniper",
    	description: "If you don't attack this turn, you can make a free attack roll and add that to next turn's ranged attack."
    };
    var prepared = {
    	id: "prepared",
    	label: "Doomsday Prep",
    	description: "Start the game with 5 free scavenge actions and 2 additional equipment slots."
    };
    var abilities = {
    	abc: abc,
    	parkour: parkour,
    	brawler: brawler,
    	cheerleader: cheerleader,
    	builder: builder,
    	scavenger: scavenger,
    	sniper: sniper,
    	prepared: prepared
    };

    var abilities$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        abc: abc,
        parkour: parkour,
        brawler: brawler,
        cheerleader: cheerleader,
        builder: builder,
        scavenger: scavenger,
        sniper: sniper,
        prepared: prepared,
        'default': abilities
    });

    const fields$1 = {
        notes: {
            id: "notes",
            type: "textarea"
        },
        ammo: {
            id: "ammo",
            type: "list",
            default: 0,
            options: {
                light: {
                    id: "ammo_light",
                    bundle: 30,
                    label: "Light"
                },
                medium: {
                    id: "ammo_medium",
                    bundle: 30,
                    label: "Medium"
                },
                heavy: {
                    id: "ammo_heavy",
                    bundle: 30,
                    label: "Heavy"
                },
                bolt: {
                    id: "ammo_bolt",
                    bundle: 5,
                    label: "Bolts"
                },
                arrow: {
                    id: "ammo_arrow",
                    bundle: 5,
                    label: "Arrows"
                }
            }
        },
        stats: {
            health: {
                id: "health",
                default: 30,
                type: "max",
                label: "Health"
            },
            stamina: {
                id: "stamina",
                default: 10,
                type: "max",
                label: "Stamina"
            },
            ap: {
                id: "ap",
                default: 4,
                type: "max",
                label: "AP"
            },
        },
        combatskills: {
            id: "combatskills",
            type: "list",
            label: "Combat Skills",
            default: 3,
            options: {
                guard: {
                    id: "guard_skill",
                    label: "Guard"
                },
                throw: {
                    id: "throw_skill",
                    label: "Throw"
                },
                blunt: {
                    id: "blunt_melee_skill",
                    label: "Blunt Melee"
                },
                firearm: {
                    id: "firearm_skill",
                    label: "Firearm"
                },
                sharp: {
                    id: "sharp_melee_skill",
                    label: "Sharp Melee"
                },
                unarmed: {
                    id: "unarmed_melee_skill",
                    label: "Unarmed"
                },
                projectile: {
                    id: "projectile_skill",
                    label: "Projectile"
                }
            }
        },
        skills: {
            id: "skills",
            type: "list",
            label: "Skills",
            default: 0,
            options: {
                lockpick: {
                    id: "lockpick_skill",
                    label: "Lockpick"
                },
                scout: {
                    id: "scout_skill",
                    label: "Scout"
                },
                stealth: {
                    id: "stealth_skill",
                    label: "Stealth"
                },
                social: {
                    id: "social_skill",
                    label: "Socialize"
                },
                firstaid: {
                    id: "firstaid_skill",
                    label: "First Aid"
                },
                construction: {
                    id: "construction_skill",
                    label: "Construction"
                },
                hacking: {
                    id: "hacking_skill",
                    label: "Hacking"
                },
                athletics: {
                    id: "athletics_skill",
                    label: "Athletics"
                }
            }
        },
        ability: {
            id: "ability",
            type: "toggleselect",
            options: abilities$1
        },
        equipmentslots: {
            id: "equipmentslots",
            default: 2,
            max: 6,
            type: "equipment",
            label: "Equipment"
        },
        inventory: {
            id: "inventory",
            default: 5,
            max: 12,
            label: "Inventory"
        }
    };

    function attrAlert(obj, prev){
        const watchedAttr = [
            fields$1.stats.health.id,
            fields$1.stats.ap.id,
            fields$1.stats.stamina.id,
            fields$1.equipmentslots.id
        ];
        let attr = '';

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

    /**
     *  Library of usefull Roll20 API Functions
     */


    /**
     * Spends X amount of attribute for a player. The attribute will be floored to 09
     * 
     * @param {integer} amount - Amount to reduce by
     * @param {string} resource - Attribute
     * @param {string} character - char ID
     * @returns object showing results of the spend.
     */
    function spendResource(amount, resource, character){
        let attr = getAttr(character, resource);

        if (!attr){
            return null;
        }

        let current = attr.get('current'),
            newVal = Math.max( current - amount, 0); //floor it at 0

        
        attr.setWithWorker({current: newVal});

        return {
            spent: current - newVal,
            remaining: newVal,
            initial: current
        }
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
     function splitArgs (input) {
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
                result[quoteSplit[i]] = i;
            }
        }
        return result;
    }


    /**
     * Gets a player's selected character. Only returns the character if the player controls the Character or is a GM
     * 
     * @param {*} sender 
     * @param {*} msg 
     * @param {*} args 
     * @returns 
     */
    function getCharacter(sender, msg, args = {}){
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
     * Retrieve an attribute for a given character
     * @param {*} character 
     * @param {*} attribute 
     * @returns The Attribute value
     */
    const getAttr = function(character, attr){
        return findObjs({type: 'attribute', characterid: character.id, name: attr})[0];
    };

    /**
     * Get Attribute Value, and use default value if not present.
     * @param {*} character 
     * @param {*} attr 
     * @returns 
     */
    const getAttrVal = function(character, attr){
        return getAttrByName(character.id, attr);
    };


    /**
     * Extract Row ID from attribute Name
     * @param {*} str 
     */
    const regexGetRowId = function(str){
        return str.match(/(?<=_)-(.*?)(?=_)/);
    };


    /**
     * Extract array of repeater IDs from character attributes
     * @param {*} repeaterId 
     * @returns 
     */
    const getRepeaterIds = function(repeaterId, characterId){
        let result = [];

        let attributes = findObjs({type:'attribute', characterid:characterId});

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
     * 
     * @returns a new row ID for a repeater row.
     */
    const generateRowID = function () {
        return generateUUID().replace(/_/g, "Z");
    };


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

    var aaany = {
    	id: "misc",
    	label: "Misc"
    };
    var blunt = {
    	id: "blunt_melee_weapon",
    	label: "Blunt Melee Weapon"
    };
    var sharp = {
    	id: "sharp_melee_weapon",
    	label: "Sharp Melee Weapon"
    };
    var firearm = {
    	id: "firearms_weapon",
    	label: "Firearm"
    };
    var projectile = {
    	id: "projectile_weapon",
    	label: "Projectile Weapon"
    };
    var throwing = {
    	id: "throwing_weapon",
    	label: "Throwing Weapon"
    };
    var consumable = {
    	id: "consumable_item",
    	label: "Consumable"
    };
    var armor = {
    	id: "armor_item",
    	label: "Armor"
    };
    var itemtypes = {
    	aaany: aaany,
    	blunt: blunt,
    	sharp: sharp,
    	firearm: firearm,
    	projectile: projectile,
    	throwing: throwing,
    	consumable: consumable,
    	armor: armor
    };

    var itemTypes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        aaany: aaany,
        blunt: blunt,
        sharp: sharp,
        firearm: firearm,
        projectile: projectile,
        throwing: throwing,
        consumable: consumable,
        armor: armor,
        'default': itemtypes
    });

    const fields = {
        name: {
            id: 'name'
        },
        type: {
            id: 'type',
            label: 'Item Type',
            options: itemTypes
        },
        damage: {
            id: 'damage',
            default: 2
        },
        uses: {
            id: 'uses',
            max: 'uses_max', // easier to handle ids and indexflight from rochesbalti
            labels: {
                ranged: 'Ammo',
                other: 'Durability',
            }
        },
        attacks: {
            id:'accuracy',
            label: 'Accuracy Mod',
            min: 1,
            default: 3,
            max: 5
        },
        ammotype: {
            id: 'ammotype',
            label: 'Ammo Type',
        },
        description: {
            id: 'description'
        }, 
        flavor: {
            id: 'flavor'
        }
    };

    const handleReload = function(args, character){
        const getAttrName = function(id, num){
            return `${fields$1.weaponslots.type}_${id}_${num}`;
        };    

        if (!("weapon" in args) || !Number.isInteger(args['weapon'])){
            return {msg:'You must specify a valid weapon (i.e. weapon=1  or weapon=2, etc)', type:'error'};
        }

        let weaponId = args['weapon'];

        const itemType = getAttr(character, getAttrName(fields.type.id, weaponId)),
            weaponType = getAttr(character, getAttrName(fields.weapontype.id, weaponId)),
            ammoType = getAttr(character, getAttrName(fields.ammotype.id, weaponId)),
            ammo = getAttr(character, getAttrName(fields.uses.id, weaponId)),
            active = getAttr(character, fields$1.weaponslots.type + '_' + weaponId);

            log(active);
            
            if (!active){
                return {msg: "Error! Could not check item active!", type: "error"};
            } else if (!itemType){
                return {msg: "Error! Could not get item type!", type: "error"};
            } else if (!weaponType){
                return {msg: "Error! Could not get weapontype!", type: "error"};
            } else if (!ammoType){
                return {msg: "Error! Could not get ammotype!", type: "error"};
            } else if (!ammo){
                return  {msg: "Error! Could not get ammo!", type: "error"};
            } else if (itemType.get('current') !== 'weapon'){
                return {msg: "Error! Item is not a weapon!", type: "error"};
            } else if (weaponType.get('current') !== 'ranged'){
                return {msg: "Error! Item is not a ranged weapon!", type: "error"};
            }
            
            const ammoMax = ammo.get("max"),
                ammoStore = getAttr(character, ammoType.get('current')), //ammoType dropdown values are the attribute for the appropriate ammo store.
                isActive = active.get('current');
        
        if (!isActive){
            return  {msg: `Weapon ${weaponId} is not active!`, type: "warning"};
        } else if (!ammoMax){
            return  {msg: "Error! Could not get max ammo!", type: "error"};
        } else if (!ammoStore){
            return  {msg: "Error! Could not get ammo store!", type: "error"};
        }
        
        const current = parseInt(ammo.get('current'), 10) || 0,
            max = parseInt(ammoMax, 10) || 0,
            store = parseInt(ammoStore.get('current'), 10) || 0,
            reload = max - current,
            ammoText = ammoType.get('current').replace('ammo_', '');

        if (current >= max){
            return  {msg: "Weapon is already at max ammo!", type: "info"};
        }

        if (store <= 0){
            //No Ammo
            return {msg: `${character.get('name')} has no ${ammoText} ammo to reload with.`, type:"warning"}
        } else if (reload >= store){
            //Successful Reload - Partial Reload
            ammo.setWithWorker({current: store + current});
            ammoStore.setWithWorker({current: 0});
            return {msg: `${character.get('name')} reloads with the last of their ${ammoText} ammo.`, type:"warning"}
        } else {
            //Successful Reload - Full Reload
            ammo.setWithWorker({current: max});
            ammoStore.setWithWorker({current: store - reload});
            return {msg: `${character.get('name')} reloads. They have ${store - reload} ${ammoText} ammo remaining.`, type:"success"}
        }
    };

    const reload = {
        caller: '!!reload',
        handler: handleReload,
        requires: ['character']
    };

    var snack = {
    	name: "Snack",
    	type: "inventory",
    	description: "Restore 1 AP (cannot exceed max). Cannot be used during combat",
    	flavor: "Organic, locally-sourced zombie-killing fuel in eco-friendly packaging.",
    	quantity: 7
    };
    var energydrink = {
    	name: "Energy Drink",
    	type: "inventory",
    	description: "Gain 2 AP (cannot exceed max). Cannot be used during combat",
    	flavor: "It's got Electrolytes. It's what plants crave.",
    	quantity: 5
    };
    var adrenaline = {
    	name: "Adrenaline",
    	type: "inventory",
    	description: "Gain 5 AP. Can exceed your max.",
    	flavor: "When you need a rush.",
    	quantity: 3
    };
    var bandage = {
    	name: "Bandage",
    	type: "inventory",
    	description: "Restore 1d6 health. Cannot be used during combat.",
    	flavor: "It's even got a dinosaur on it!",
    	quantity: 5
    };
    var firstaidkit = {
    	name: "First Aid Kit",
    	type: "inventory",
    	description: "Restore 2d6 health. Cannot be used during combat.",
    	flavor: "It's basically just two bandages in a box.",
    	quantity: 3
    };
    var medkit = {
    	name: "Med Kit",
    	type: "inventory",
    	description: "Restore 4d6 health. Cannot be used during combat.",
    	flavor: "It's merely a flesh wound.",
    	quantity: 2
    };
    var ammo = {
    	name: "Reload",
    	type: "inventory",
    	description: "Fill 1 Ranged weapon to its max ammo. Uses 3 AP to use during combat.",
    	flavor: "All-purpose, one size fits all ammunition.",
    	quantity: 15
    };
    var backpack = {
    	name: "Fanny Pack",
    	type: "equipment",
    	description: "When this is equipped, increase your available inventory slots by 1.",
    	flavor: "Stylish AND functional.",
    	quantity: 4
    };
    var holster = {
    	name: "Weapon Holster",
    	type: "equipment",
    	description: "When this is equipped, increase your available weapon slots by 1 (Up to a maximum of 4 weapon slots)",
    	flavor: "Your standard handgun/rifle/sword/rocket launcher holder.",
    	quantity: 3
    };
    var belt = {
    	name: "Utiliy Belt",
    	type: "inventory",
    	description: "Delete this item. Increase your available equipment slots by 1 (Up to a maximum of 5 equipment slots)",
    	flavor: "Batman would be jealous.",
    	quantity: 3
    };
    var barricade1 = {
    	name: "Sandbags!",
    	type: "inventory",
    	description: "Delete this item. Build a barricade anywhere with 2d6 health. Cannot use during combat",
    	flavor: "Made with really, really lightweight sand.",
    	quantity: 6
    };
    var barricade2 = {
    	name: "Boards and Nails",
    	type: "inventory",
    	description: "Delete this item. Build a barricade with 4d6 health. Cannot use during combat",
    	flavor: "No hammer required.",
    	quantity: 4
    };
    var armor1 = {
    	name: "Improvised Armor",
    	type: "equipment",
    	description: "Increase your Armor by 1.",
    	flavor: "Enough Duct Tape can do just about anything.",
    	quantity: 3
    };
    var armor2 = {
    	name: "Sporting Pads",
    	type: "equipment",
    	description: "Increase your Armor by 2.",
    	flavor: "Perfect for doing that sport with the sporting ball.",
    	quantity: 2
    };
    var armor3 = {
    	name: "Tactical Gear",
    	type: "equipment",
    	description: "Increase your Armor by 4.",
    	flavor: "Looking pretty tacticool.",
    	quantity: 2
    };
    var armor4 = {
    	name: "Plate Armor",
    	type: "equipment",
    	description: "Increase your Armor by 8. Reduce your dodge by 2.",
    	flavor: "Time to get medieval on their ass.",
    	quantity: 1
    };
    var dodge1 = {
    	name: "Exercise Clothes",
    	type: "equipment",
    	description: "Increase your dodge roll by 1.",
    	flavor: "You feel just a tad bit more limber.",
    	quantity: 2
    };
    var dodge2 = {
    	name: "Arm Guards",
    	type: "equipment",
    	description: "Increase your dodge roll by 2.",
    	flavor: "Good luck biting into these.",
    	quantity: 2
    };
    var dodge3 = {
    	name: "Shield",
    	type: "equipment",
    	description: "Increase your dodge roll by 3.",
    	flavor: "It's not made of vibranium, but it's a decent shield.",
    	quantity: 2
    };
    var dodge4 = {
    	name: "Really nice sneakers.",
    	type: "equipment",
    	description: "Increase your dodge roll by 6. Has no effect if you have any bonus armor at all. Only one can be equipped at a time.",
    	flavor: "So light and breezy",
    	quantity: 1
    };
    var grenade = {
    	name: "Grenade",
    	type: "equipment",
    	description: "Deal 40 damage to a square within 7 squares and all its adjacent squares.",
    	flavor: "Just a casual fragmentation grenade lying around.",
    	quantity: 3
    };
    var molotov = {
    	name: "Molotov",
    	type: "equipment",
    	description: "Light a square and its adjacent squares on fire within 7 squares for 3 rounds. Deals 10 damage and 5 ongoing damage to anyone who walks through.",
    	flavor: "Liquor? I barely even lit her on fire!",
    	quantity: 2
    };
    var knife = {
    	name: "Knife",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d4",
    	uses: 20,
    	flavor: "Great for cutting vegetables, fruit, and brains.",
    	quantity: 1
    };
    var baseballbat = {
    	name: "Baseball Bat",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d6",
    	uses: 30,
    	flavor: "It is now past the time... for America's favorite pastime.",
    	quantity: 1
    };
    var nailbat = {
    	name: "Nailbat",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d8+2",
    	uses: 20,
    	flavor: "Peanut Butter and Jelly. Burger and Fries. Ham and Cheese. Nails and a Bat. ",
    	quantity: 1
    };
    var combatknife = {
    	name: "Ka-Bar Knife",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d8",
    	uses: 40,
    	flavor: "Hoo-rah.",
    	quantity: 1
    };
    var machete = {
    	name: "Machete",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d10",
    	uses: 40,
    	flavor: "Great tool for re-deading the undead.",
    	quantity: 1
    };
    var axe = {
    	name: "Axe",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d12",
    	uses: 50,
    	flavor: "Stumped?",
    	quantity: 1
    };
    var katana = {
    	name: "Katana",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d12+4",
    	uses: 40,
    	flavor: "Forgive me sensei, I must go all out. Just this once.",
    	quantity: 1
    };
    var sword = {
    	name: "Sword",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d16",
    	uses: 60,
    	flavor: "Why socialize when you could study the way of the sword?",
    	quantity: 1
    };
    var chainsaw = {
    	name: "Chainsaw",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d20+10",
    	uses: 10,
    	flavor: "It's about to be a massacre.",
    	quantity: 1
    };
    var lawnmower = {
    	name: "Lawnmower",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "25",
    	uses: 1,
    	description: "The turn you use this, you attack as you move, dealing damage to each square you move through",
    	flavor: "Party's over.",
    	quantity: 1
    };
    var handgun = {
    	name: "Handgun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d8",
    	uses: 10,
    	ammotype: "ammo_1d6",
    	flavor: "Pew pew pew.",
    	quantity: 1
    };
    var revolver = {
    	name: "Revolver",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d12r<4",
    	uses: 6,
    	ammotype: "ammo_d8",
    	flavor: "Do you feel lucky?",
    	quantity: 1
    };
    var uzi = {
    	name: "Uzi",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d6",
    	uses: 20,
    	ammotype: "ammo_1d6",
    	flavor: "Spray and Pray",
    	quantity: 1
    };
    var bow = {
    	name: "Bow",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d10r<5",
    	uses: 3,
    	ammotype: "ammo_arrow",
    	description: "If you kill your target, leave a marker at the target. You can regain all spent Arrows used this turn if you pick up the marker",
    	flavor: "Silent but deadly.",
    	quantity: 1
    };
    var shotgun = {
    	name: "Shotgun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "4d4",
    	uses: 5,
    	ammotype: "ammo_d4",
    	flavor: "Hail to the King, baby.",
    	quantity: 1
    };
    var assaultrifle = {
    	name: "Assault Rifle",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d8+1",
    	uses: 25,
    	ammotype: "ammo_d10",
    	flavor: "Now we're talking.",
    	quantity: 1
    };
    var snipperrifle = {
    	name: "Sniper Rifle",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d20r<8",
    	uses: 5,
    	ammotype: "ammo_d12",
    	flavor: "BOOM! Headshot!",
    	quantity: 1
    };
    var machinegun = {
    	name: "Machine Gun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d10+2",
    	uses: 30,
    	ammotype: "ammo_d20",
    	description: "",
    	flavor: "Our bullets will blot out the sun.",
    	quantity: 1
    };
    var grenadelauncher = {
    	name: "Grenade Launcher",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d30r<10",
    	uses: 5,
    	ammotype: "ammo_d20",
    	description: "This cannot be reloaded. If hitting single targets, it will damage adjacent squares to the target.",
    	flavor: "Our bullets will blot out the sun.",
    	quantity: 1
    };
    var flamethrower = {
    	name: "Flamethrower",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "20",
    	uses: 5,
    	ammotype: "ammo_d20",
    	description: "This cannot be reloaded. This weapon fires in a line of 5 spaces, dealing damage to all targets within the line.",
    	flavor: "Turns out the zombies have a weakness to being lit on freakin' fire.",
    	quantity: 1
    };
    var items = {
    	snack: snack,
    	energydrink: energydrink,
    	adrenaline: adrenaline,
    	bandage: bandage,
    	firstaidkit: firstaidkit,
    	medkit: medkit,
    	ammo: ammo,
    	backpack: backpack,
    	holster: holster,
    	belt: belt,
    	barricade1: barricade1,
    	barricade2: barricade2,
    	armor1: armor1,
    	armor2: armor2,
    	armor3: armor3,
    	armor4: armor4,
    	dodge1: dodge1,
    	dodge2: dodge2,
    	dodge3: dodge3,
    	dodge4: dodge4,
    	grenade: grenade,
    	molotov: molotov,
    	knife: knife,
    	baseballbat: baseballbat,
    	nailbat: nailbat,
    	combatknife: combatknife,
    	machete: machete,
    	axe: axe,
    	katana: katana,
    	sword: sword,
    	chainsaw: chainsaw,
    	lawnmower: lawnmower,
    	handgun: handgun,
    	revolver: revolver,
    	uzi: uzi,
    	bow: bow,
    	shotgun: shotgun,
    	assaultrifle: assaultrifle,
    	snipperrifle: snipperrifle,
    	machinegun: machinegun,
    	grenadelauncher: grenadelauncher,
    	flamethrower: flamethrower
    };

    var items$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        snack: snack,
        energydrink: energydrink,
        adrenaline: adrenaline,
        bandage: bandage,
        firstaidkit: firstaidkit,
        medkit: medkit,
        ammo: ammo,
        backpack: backpack,
        holster: holster,
        belt: belt,
        barricade1: barricade1,
        barricade2: barricade2,
        armor1: armor1,
        armor2: armor2,
        armor3: armor3,
        armor4: armor4,
        dodge1: dodge1,
        dodge2: dodge2,
        dodge3: dodge3,
        dodge4: dodge4,
        grenade: grenade,
        molotov: molotov,
        knife: knife,
        baseballbat: baseballbat,
        nailbat: nailbat,
        combatknife: combatknife,
        machete: machete,
        axe: axe,
        katana: katana,
        sword: sword,
        chainsaw: chainsaw,
        lawnmower: lawnmower,
        handgun: handgun,
        revolver: revolver,
        uzi: uzi,
        bow: bow,
        shotgun: shotgun,
        assaultrifle: assaultrifle,
        snipperrifle: snipperrifle,
        machinegun: machinegun,
        grenadelauncher: grenadelauncher,
        flamethrower: flamethrower,
        'default': items
    });

    const templates = items$1;
    const acceptedFields = (()=>{ //get acceptable params - the key of the field in card. Note we use the field key NOT the field ID!
        let result = [];
        for (let key in fields){

            result.push(key);

            if ('max' in fields[key] && fields[key].max == true) result.push(key + '_max'); //add max fields 
        }
        return result;
    })();


    const handlePickup = function(args, character){
        
        let item = {};

        // pull from existing template
        if ("item" in args && args.item in templates){
            item = templates[args.item];
        }

        //add any new props
        for (let key in args){
            if (acceptedFields.includes(key)){
                item[key] = args[key];
            }
        }



        if (Object.keys(item).length){

            let inventorySlots = getAttrVal(character, fields$1.inventory.id);
            let inventoryIds = getRepeaterIds(fields$1.inventory.id, character.id);

            if (inventoryIds.length >= inventorySlots){
                return {msg: "Error: Character has no more available inventory slots!", type: "error"};
            }

            createInventoryItem(character, item);
            return {msg: `${character.get('name')} picked up a ${item["name"] || 'Item'}`, type:"success"};
        } else {
            return {msg: "Error: Invalid item or no arguments provided.", type: "error"}
        }
    };


    function createInventoryItem(character, item){
        var rowId = generateRowID();

        for (let key in item){

            //Don't handle max fields - max needs to be set as a property of an attribute
            if (key.endsWith('_max')){
                continue;
            }

            let fld = fields[key]; //get original field

            if (!fld){
                continue;
            }

            let attr = {};

            attr.name = `repeating_${fields$1.inventory.id}_${rowId}_${fld.id}`;
            attr.current = item[key];
            attr.characterid = character.id;

            if ('max' in fld && fld.max == true){
                attr.max = item[key];

                if (item.hasOwnProperty(key + '_max')){
                    attr.max = item[key + '_max'] || '';
                } else {
                    attr.max = attr.current;
                }
            }

            createObj("attribute", attr);
        }
    }

    const pickup = {
        caller: "!!pickup",
        handler: handlePickup,
        requires: ['character']
    };

    /**
     * Roll System where we use a declining Pool of dice.
     * 
     * For each roll, we roll up to a single specified pool amount. Each roll is compared against a target success number to obtain a number of successes.
     * 
     * Then we can subtract a cost from a specified attribute. Usually want to subtract the pool by 1.
     * 
     */
    const RollAP = (function(){
        const handleResults = function(response, sender, character){
            let output = `&{template:default} {{name=${response.title || 'AP Roll'}}}`;

            //Action flavor text
            if ('action' in response){
                output += ` {{action=${response.action}}}`;
            }


            if ('fail' in response){
                output += ` {{failure=${response.fail}}}`;
            }

            if ('roll' in response){

                let multi = response.multiply.field || 1;            

                // do roll separately so we can reference them later on as per https://wiki.roll20.net/Reusing_Rolls
                output += ` [[[[${response.roll}]]*[[${multi}]]]] `;

                output += ` {{Roll= $[[0]] Successes!}} `;

                
                if ('multiply' in response){
                    output += ` {{${response.multiply.label}=$[[0]] * $[[1]]==$[[2]] }}`;
                }
            }
            
            sendChat(sender, output);
        },


        /**
         * Roll Logic - subtract costs, generate a roll text and return
         * 
         * @param {*} args 
         * @param {*} character 
         * @returns 
         */
        handleRoll = function(args, character){
            const params = setupParams(args);
            const result = {title: args.title, action: args.action};


            if (params.cost > 0){
                if (!character){
                    throw 'Attempted to subtract resource without specifying a target token!';
                }

                log(params.resource);

                for (let res of params.resource){
                    let val = getAttrVal(character, res.field);
                    
                    //check if we can roll at all 
                    if (val - params.cost < 0){
                        result.fail = `${character.get('name')} does not have enough ${res.label}!`;
                        return result;
                    }
                }

                // Loop again for spending resource  as we want to make sure the first loop catches any failures first
                for (let res of params.resource){
                    spendResource(params.cost, res.field, character);
                }
            }


            if (params.multiply.length){
                result.multiply = params.multiply[0];
            }

            result.roll = generateRollText(params.pool, params.dice, params.target, params.modifier, params.difficulty);

            return result;
        },

        /**
         * Generates a roll command.
         * 
         * @param {int} dice - dice to use
         * @param {int} dicemod - modifiers on dice
         * @param {int} amount - amount of dice
         * @param {int} mod - modifier on each roll
         */
        generateRollText = function(amount, dice, target, mod = 0, dicemod = 0){

            //Why subtract?
            //Since we are using less than for comparison (<), smaller dice is better. 1 is the best roll we can get.
            //But we want positive values on the sheet to symbolize improvements. 
            //So subtract instead of add as positive values would then improve rolls and negative would then make it worse.
            let totalDice = dice - dicemod;
            let modifier = (mod != 0) ? `-${mod}` : '';

            return `{${amount}d${totalDice}${modifier}}<${target}`
        },

        defaultParams = function(){
            return {
                dice: 10,
                pool: 10,
                cost: 1,
                target: 3,
                multiply: '',
                resource: `${fields$1.stats.ap.id}:${fields$1.stats.ap.label}`,
                modifier: '',
                difficulty: '',
                title: 'AP Roll',
                action: ''
            };
        },

        /**
         * Parse Args for the roll. Multiple values for 1 param can be split by |
         * 
         * Args
         * @property {integer} dice                         - Which dice to use
         * @property {integer} pool                         - Amount of Dice for the roll.
         * @property {integer} cost                         - Cost per roll. Defaults to 1
         * @property {integer} target                       - Target Number to match to be considered a success.
         * @property {string}  multiply                     - Add a line to multiply results of the roll. Add label with : (example - prop:label)
         * @property {string}  resource                     - What char attr to subtract cost from. You can add a label with : (example - attr:label)
         * @property {integer or string} modifier           - add a modifier to each roll. Note this gets added on each dice in the pool
         * @property {integer or string} difficulty         - add a modifier to the dice itself. Modifies which dice you end up rolling.
         * 
         * @param {object} args 
         * @param {string} character 
         */
        setupParams  = function(args){
            const defParams = defaultParams();

            //overwrite default with provided args
            const params = {...defParams, ...args};

            if (!Number.isInteger(params.dice) || !Number.isInteger(params.pool) || !Number.isInteger(params.cost)){
                throw 'Invalid Parameters - expected an Integer!';
            }

            params.resource = parseFieldLabel(parseMultiArg(params.resource));
            params.modifier = sumValues(parseMultiArg(params.modifier));
            params.difficulty = sumValues(parseMultiArg(params.difficulty));
            params.multiply = parseFieldLabel([params.multiply], 'Effect');
            
            return params;
        },


        //sum up an array of strings
        sumValues = function(values){
            return values.reduce((prev, curr) =>{
                return prev + (Number.parseInt(curr, 10) || 0);
            }, 0)
        },

        //parse array of strings into an array of label/fields
        //use : to denote field:label
        parseFieldLabel = function(resources, defaultLabel = ''){
            const result = [];

            for (let res of resources){
                let split = res.split(':');

                if (split.length && split[0].length){
                    let label = split[1] || (defaultLabel.length ? defaultLabel : split[0]);
                    result.push({
                        field: split[0].trim(),
                        label: label.trim()
                    });
                }
            }

            return result;
        },

        //Split among pipe so we can have multiple args
        parseMultiArg = function(arg){
            return arg.toString().split('|').map(x => x.trim()).filter(x => x);
        };

        //TODO - probably a cleaner way to do this but otherwise we get errors with missing functions and stuff
        return {
            caller: '!!aproll',
            handler: handleRoll,
            responder: handleResults,
            generateRollText: generateRollText,
            parseFieldLabel: parseFieldLabel,
            parseMultiArg: parseMultiArg,
            defaultParams: defaultParams,
            sumValues: sumValues,
            setupParams: setupParams
        }
    })();

    class Deck {
        constructor(arr=[]){
            this.deck = arr;
        }

        addCard(card, random=true){

            if (random){
                let i = Math.floor(Math.random() * this.deck.length);
                this.deck.splice(i, 0, card);
            } else {
                this.deck.push(card);
            }
        }

        drawCard(){
            return this.deck.pop();
        }

        removeCard(card){
            for (let i = this.deck.length - 1; i >= 0; i--){
                if (this.deck[i] == card){
                    this.deck.splice(i, 1);
                    return;
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


    const cardDeck = (function(){
        const deck = new Deck();
        const ratio = 1;


        const setupDeck = function(){
            deck.clearDeck();

            for (let key in items$1){
                let item = items$1[key],
                    quantity = item.quantity || 1;

                if(key == 'default'){ //somehow, we're importing a default value.
                    continue;
                }

                
                let count = Math.floor(ratio * quantity);

                for (let i = 0; i < count; i++){
                    deck.addCard(key);
                }
            }

            //because unit testing throws an error here for some reason (log is not a function unless on roll20)
            try {
                log("Initialized Deck with " + deck.getLength() + ' cards!');
            } catch(e){

            }

            deck.shuffleDeck();
        };


        const handleArgs = function(args, character){
            let retVal = {};

            if ("reset" in args && args['reset']==true){
                setupDeck();
                log('Deck Reset!');
                log(deck.getDeck());
            }

            if ("shuffle" in args && args['shuffle']==true){
                log('Deck Shuffled!');
                deck.shuffleDeck();
                log(deck.getDeck());
            }

            if ("draw" in args){
                log('Card Drawn!');
                let card = deck.drawCard();
                log(card);
                log(deck.getDeck());


                if (!card){ 
                    retVal.error = "Deck has no more cards!";
                } else {
                    retVal.card = card;
                }
            }

            if ("set" in args){
                try {
                    log(args['set']);
                    let json = JSON.parse(args['set']);
                    deck.clearDeck();
                    for(let itm of json){
                        deck.addCard(itm);
                    }
                    log("Set Deck with " + deck.getLength() + ' cards!');

                    deck.shuffleDeck();
                } catch(e){
                    log(e.message);
                    log('Error');
                }
            }

            if ("add" in args && args['add'].length){
                log('Card Added!');
                deck.addCard(args['add']);
                log(deck.getDeck());
            }

            if ("remove" in args && args['remove'].length){
                log('Card Removed!');
                deck.removeCard(args['remove']);
                log(deck.getDeck());
            }

            if ("info" in args){
                retVal.info = `Deck has ${deck.getDeck().length} cards remaining!`;
            }
            
            return retVal;
        };
        
        const handleResponse = function(response, sender, character){
            
            if (response){
                let msg = '';
                if ('info' in response){
                    sendChat(sender, `/w gm ${response.info}`);
                }
                
                if ('error' in response || 'card' in response ){
                    msg += `&{template:default} {{name=${character.get('name')} attempts to scavenge for an item!}} `;
                }

                if ('error' in response){
                    msg += ` {{Error=${response.error}}}`;
                }
                
                if ('card' in response){
                    let itemkey = response.card;

                    if (itemkey in items$1){
                        let item = items$1[itemkey];

                        log(item);
                        log(itemkey);

                        msg += ` {{Result= ${character.get('name')} found a ${item.name}!}} `;

                        sendChat(sender, `!!pickup item='${itemkey}' characterid='${character.get('id')}'`);
                    } else {
                        msg += `{{Result= ${character.get('name')} found a ${itemkey}. This is not a registered item!}}`;
                    }
                }


                if (msg.length){
                    sendChat(sender, msg);
                }
            }
        };

        
        setupDeck(); //Setup on initial upload of script.

        return {
            caller: '!!deck', 
            handler: handleArgs,
            responder: handleResponse,
            requires: ['character']
        };
    })();

    /**
     * Main handler. We register our API Scripts into this so we can have a single caller for all api scripts.
     */

    var Main = Main || (function(){

        const apiCallers = {};
        const attrWatchers = [];

        /**
         * Register API Callers. Hook for adding in new APIs into this main one.
         * 
         * @param {*} obj - Expects an object which contains 'caller' - msg in api to trigger the script - and 'handler' - function that does the api work based off the passed in args.
         * @returns 
         */
        const RegisterApiCaller = function(obj){
            if (!('caller' in obj) || !('handler' in obj)){
                return;
            }

            apiCallers[obj.caller] = {
                handler: obj.handler
            };

            if ('responder' in obj){
                apiCallers[obj.caller].responder = obj.responder;
            } else {
                apiCallers[obj.caller].responder = standardResponder;
            }
        };


        /**
         * Add an attribute watcher.
         */
        const RegisterAttrWatcher = function(obj){
            attrWatchers.push(obj);
        };

        /**
         * Default responder, which just prints out a message of a given type.
         * @param {*} obj 
         * @param {*} sender 
         * @param {*} character 
         */
        const standardResponder = function(obj, sender, character){
            if ("msg" in obj && "type" in obj){
                sendMessage(obj.msg, sender, obj.type);
            }
        };

        /**
         * Router function. Takes a chat msg that begins with an API and then matches it to an API Caller thats
         * registered to this. Then call the appropriate handler and responder 
         * 
         * @param {*} msg 
         * @returns 
         */
        const HandleInput = function(msg) {

            if (msg.type !== "api"){
                return;
            }
            
            // Setup our character and args.
            const args = splitArgs(msg.content),
                sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
                character = getCharacter(sender, msg, args);

            // Go through our registered APIs and call as appropriate
            for (const api in apiCallers){
                if (msg.content.startsWith(api)){
                    try {
                        let caller = apiCallers[api];
        
                        // Flow - API handles the args, and then sends it to a responder to do the rest.
                        let response = caller.handler(args, character);
                        caller.responder(response, sender, character);
                    } catch(err){
                        log(err);
                        sendMessage(err, 'Error: ' + api, 'error');
                    }
                }
            }
        };

        // Single function call for all attribute watchers
        const HandleAttributeChange = function(obj, prev){
            for (let watcher of attrWatchers){
                try {
                    watcher(obj, prev);
                } catch(err){
                    log(watcher);
                    sendMessage(err, 'Error in attribute watcher:', 'error');
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
            RegisterApiCaller: RegisterApiCaller,
            RegisterAttrWatcher: RegisterAttrWatcher
        }
    })();


    on("ready", function(){
        Main.RegisterApiCaller(cardDeck);
        Main.RegisterApiCaller(pickup);
        Main.RegisterApiCaller(reload);
        Main.RegisterApiCaller(RollAP);
        // Main.RegisterApiCaller(attack);
        // Main.RegisterApiCaller(combat);
        Main.RegisterAttrWatcher(attrAlert);
        Main.init();
    });

})();
