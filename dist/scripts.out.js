(function () {
    'use strict';

    var abilities = [
    	{
    		id: "",
    		label: "",
    		description: ""
    	},
    	{
    		id: "actionstar",
    		label: "Action Star",
    		description: "Increase your max action points by 2"
    	},
    	{
    		id: "cheerleader",
    		label: "Cheerleader",
    		description: "<strong>Action:</strong> Give adjacent players a single bonus dice roll until your next turn."
    	},
    	{
    		id: "brawler",
    		label: "Brawler",
    		description: "Adds 2 bonus rolls to any melee attack."
    	},
    	{
    		id: "builder",
    		label: "Builder",
    		description: "Use a D10 when building barricades and add 1 bonus dice roll."
    	},
    	{
    		id: "doctor",
    		label: "Doctor",
    		description: "Use a D10 when restoring health and add 1 bonus dice roll."
    	},
    	{
    		id: "Reflexes",
    		label: "Reflexes",
    		description: "Use a D10 when doing defense rolls."
    	},
    	{
    		id: "scavenger",
    		label: "Scavenger",
    		description: "Whenever you scavenge, scavenge 1 additional item."
    	},
    	{
    		id: "scout",
    		label: "Scout",
    		description: "Gain better vision in the dark. Sense approaching enemies."
    	},
    	{
    		id: "sniper",
    		label: "Sniper",
    		description: "Add +2 on every attack roll you make."
    	},
    	{
    		id: "tanky",
    		label: "Tanky",
    		description: "Increase your starting health by 20."
    	}
    ];

    var abilities$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
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
            options: {
                d4: {
                    id: "ammo_d4",
                    default: 0,
                    label: "d4"
                },
                d6: {
                    id: "ammo_d6",
                    default: 0,
                    label: "d6"
                },
                d8: {
                    id: "ammo_d8",
                    default: 0,
                    label: "d8"
                },
                d10: {
                    id: "ammo_d10",
                    default: 0,
                    label: "d10"
                },
                d12: {
                    id: "ammo_d12",
                    default: 0,
                    label: "d12"
                },
                d20: {
                    id: "ammo_d20",
                    default: 0,
                    label: "d20"
                },
                bolt: {
                    id: "ammo_bolt",
                    default: 0,
                    label: "Bolts"
                },
                arrow: {
                    id: "ammo_arrow",
                    default: 0,
                    label: "Arrows"
                }
            }
        },
        stats: {
            hp: {
                id: "hp",
                default: 30,
                type: "max",
                label: "HP"
            },
            ap: {
                id: "ap",
                default: 5,
                type: "max",
                label: "AP"
            },
        },
        defense: {
            id: "defense",
            default: 4,
            type: "dice",
            bonus: {
                id: 'defense_bonus',
                default: 0
            }
        },
        ability: {
            id: "ability",
            type: "toggleselect",
            options: abilities$1
        },
        weaponslots: {
            id: "weaponslots",
            label: "Weapons",
            default: 1,
            max: 3,
            type: "weapon"
        },
        equipmentslots: {
            id: "equipmentslots",
            default: 3,
            max: 5,
            type: "equipment",
            label: "Equipment"
        },
        inventory: {
            id: "inventory",
            default: 5,
            max: 9,
            label: "Inventory"
        }
    };

    function attrAlert(obj, prev){
        const watchedAttr = [
            character.stats.hp.id,
            character.stats.ap.id,
            character.weaponslots.id,
            character.equipmentslots.id
        ];
        const ammoTypes = character.ammo.options;
        let attr = '';

        for (let type of ammoTypes){
            watchedAttr.push(type.id);
        }

        if (watchedAttr.includes(obj.get("name"))){
            attr = obj.get("name").replace('ammo_', '');
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
     * Tokenizes chat inputs for API commands
     * 
     * Step 1 - Splits chat by space unless the space is within single or double quotes.                                    Example: !example with 'text line' "hello world" gets split to ["!example", "with", "text line" "hello world"]
     * Step 2 - Tokenize everything into a Struct using a '=' to denote an argument in the form of [arg]=[value].           Example: !example test="hello world" is {0:"!example" test: "hello world"}
     * Step 2a - Everything to left of '=' becomes the key and everything to the right becomes the value
     * Step 2b - If no '=', the key is the array position of the split
     * Step 3 - If no regex match for =, check for any flags in the form of --flag                                          Example: --unarmed    
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
                return e.replace(/['"]+/g, ''); //remove quotes
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
            !_.contains(character.get('controlledby').split(','),'all')){
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

    const fields = {
        name: {
            id: 'itemname'
        },
        type: {
            id: 'itemtype',
            label: "Item Type",
            options: [
                'inventory',
                'weapon',
                'equipment'
            ]
        },
        damage: {
            id: 'itemdamage'
        },
        weapontype: {
            id: 'weapontype',
            options: [
                'melee',
                'ranged'
            ],
            label: 'Weapon Type',
            default: 'melee'
        },
        uses: {
            id: 'uses',
            max: true,
            labels: {
                melee: 'Durability',
                ranged: 'Ammo'
            }
        },
        ammotype: {
            id: 'ammotype',
            label: 'Ammo Type'
        },
        description: {
            id: 'description'
        }, 
        flavor: {
            id: 'flavor'
        },
    };

    function handleReload(character, weaponId){
        const getAttrName = function(id, num){
            return `${fields$1.weaponslots.type}_${id}_${num}`;
        };    

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
    }

    var snack = {
    	name: "Snack",
    	type: "inventory",
    	description: "Restore 5 energy."
    };
    var energydrink = {
    	name: "Energy Drink",
    	type: "inventory",
    	description: "Restore 10 energy.",
    	flavor: "Its got Electrolytes."
    };
    var adrenaline = {
    	name: "Adrenaline",
    	type: "inventory",
    	description: "Restore 20 energy.",
    	flavor: "When you need a rush."
    };
    var bandage = {
    	name: "Bandage",
    	type: "inventory",
    	description: "Restore 1d6 health.",
    	flavor: "A band-aid a day keeps the undead away."
    };
    var firstaidkit = {
    	name: "First Aid Kit",
    	type: "inventory",
    	description: "Restore 2d6 health."
    };
    var medkit = {
    	name: "Med Kit",
    	type: "inventory",
    	description: "Restore 4d6 health.",
    	flavor: "For if it's merely a flesh wound."
    };
    var backpack = {
    	name: "Fanny Pack",
    	type: "equipment",
    	description: "When this is equipped, increase your available inventory slots by 1. (Up to a maximum of 9 inventory slots)",
    	flavor: "Stylish and functional."
    };
    var holster = {
    	name: "Weapon Holster",
    	type: "equipment",
    	description: "When this is equipped, increase your available weapon slots by 1 (Up to a maximum of 4 weapon slots)",
    	flavor: "Your standard handgun/rifle/sword/rocket launcher/etc holder."
    };
    var belt = {
    	name: "More Pockets!",
    	type: "inventory",
    	description: "Delete this item. Increase your available equipment slots by 1 (Up to a maximum of 5 equipment slots)",
    	flavor: "So much room for activites."
    };
    var barricade1 = {
    	name: "Sandbags!",
    	type: "inventory",
    	description: "Delete this item. Build a barricade anywhere with 2d6 health.",
    	flavor: "So much room for activites."
    };
    var barricade2 = {
    	name: "Boards and Nails",
    	type: "inventory",
    	description: "Delete this item. Build a barricade with 4d6 health at the entrance of any room.",
    	flavor: "Who needs a hammer?"
    };
    var armor1 = {
    	name: "Duct Tape Armor",
    	type: "equipment",
    	description: "Increase your Armor by 1.",
    	flavor: "Enough Duct Tape can do just about anything."
    };
    var armor2 = {
    	name: "Sporting Pads",
    	type: "equipment",
    	description: "Increase your Armor by 3.",
    	flavor: "Hit them with the sporting ball while in your sporting protection while doing the sport."
    };
    var armor3 = {
    	name: "Tactical Gear",
    	type: "equipment",
    	description: "Increase your Armor by 5.",
    	flavor: "Looking pretty tacticool."
    };
    var armor4 = {
    	name: "Plate Armor",
    	type: "equipment",
    	description: "Increase your Armor by 10. Reduce dodge by 2.",
    	flavor: "Time to get medieval on their ass."
    };
    var dodge1 = {
    	name: "Exercise Tape",
    	type: "equipment",
    	description: "Increase dodge by 1.",
    	flavor: "It's probably just a mental thing, but you feel limber."
    };
    var dodge2 = {
    	name: "Nice Shoes",
    	type: "equipment",
    	description: "Increase dodge by 2. Only 1 can be equipped at a time.",
    	flavor: "Literally just shoes that are nice. But like, super nice though."
    };
    var dodge3 = {
    	name: "Exercise Clothes",
    	type: "equipment",
    	description: "Increase dodge by 6. Has no effect when your armor is 5 or more.",
    	flavor: "So light and breezy"
    };
    var knife = {
    	name: "Knife",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d4",
    	uses: 25,
    	flavor: "Great for cutting vegetables, fruit, and brains."
    };
    var baton = {
    	name: "Baton",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d6",
    	uses: 35,
    	flavor: "Beat them to death... again."
    };
    var baseballbat = {
    	name: "Baseball Bat",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d6+1",
    	uses: 25,
    	flavor: "It is now past the time... for America's favorite pastime."
    };
    var crowbar = {
    	name: "Crowbar",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d8<2",
    	uses: 45,
    	flavor: "Great for prying off crabs."
    };
    var machete = {
    	name: "Machete",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d8+2",
    	uses: 30,
    	flavor: "Classic undead re-deading equipment."
    };
    var sword = {
    	name: "Sword",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d10+3",
    	uses: 40,
    	flavor: "Yes, it's an actual sword."
    };
    var combatknife = {
    	name: "Ka-Bar Knife",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d10<2",
    	uses: 55,
    	flavor: "Hoo-rah."
    };
    var katana = {
    	name: "Katana",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d12+4",
    	uses: 40,
    	flavor: "Forgive me sensei, I must go all out. Just this once."
    };
    var axe = {
    	name: "Axe",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d12<3",
    	uses: 55,
    	flavor: "Time to chop up some firewood."
    };
    var chainsaw = {
    	name: "Chainsaw",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "1d20+10",
    	uses: 12,
    	flavor: "It's about to be a massacre."
    };
    var lawnmower = {
    	name: "Lawnmower",
    	type: "weapon",
    	weapontype: "melee",
    	damage: "100",
    	uses: 1,
    	description: "The turn you use this, you attack as you move, dealing damage to each square you move through",
    	flavor: "Party's over."
    };
    var handgun = {
    	name: "Handgun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d6+2",
    	uses: 12,
    	ammotype: "ammo_1d6",
    	flavor: "Pew pew pew."
    };
    var uzi = {
    	name: "Uzi",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d6",
    	uses: 30,
    	ammotype: "ammo_1d6",
    	flavor: "Spray and Pray"
    };
    var revolver = {
    	name: "revolver",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d8+4",
    	uses: 6,
    	ammotype: "ammo_d8",
    	flavor: "Do you feel lucky?"
    };
    var crossbow = {
    	name: "Crossbow",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d8<4",
    	uses: 5,
    	ammotype: "ammo_Bolt",
    	description: "If you kill your target, leave a marker at the target. You can regain 1 Bolt by picking up the marker.",
    	flavor: "Automatically makes you the most popular character."
    };
    var shotgun = {
    	name: "Shotgun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "4d4",
    	uses: 5,
    	ammotype: "ammo_d4",
    	flavor: "Hail to the King, baby."
    };
    var autoshotgun = {
    	name: "Auto Shotgun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "3d4",
    	uses: 8,
    	ammotype: "ammo_d4",
    	flavor: "The N00bCann0n."
    };
    var magnum = {
    	name: "Desert Eagle",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d10+6",
    	uses: 7,
    	ammotype: "ammo_d10",
    	flavor: "High caliber kick-ass"
    };
    var assaultrifle = {
    	name: "Assault Rifle",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d10<3",
    	uses: 20,
    	ammotype: "ammo_d10",
    	flavor: "Now we're talking."
    };
    var snipperrifle = {
    	name: "Sniper Rifle",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d12+8",
    	uses: 5,
    	ammotype: "ammo_d12",
    	flavor: "BOOM! Headshot!"
    };
    var bow = {
    	name: "Compound Bow",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d12<6",
    	uses: 5,
    	ammotype: "ammo_Arrow",
    	description: "If you kill your target, leave a marker at the target. You can regain 1 Ammo by picking up the marker.",
    	flavor: "FWSH! Headshot!"
    };
    var machinegun = {
    	name: "Machine Gun",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d20",
    	uses: 100,
    	ammotype: "ammo_d20",
    	flavor: "Our bullets will blot out the sun."
    };
    var flamethrower = {
    	name: "Flamethrower",
    	type: "weapon",
    	weapontype: "ranged",
    	damage: "1d20+20",
    	uses: 5,
    	ammotype: "ammo_d20",
    	description: "This weapon fires in a line of 5 spaces, dealing damage to all targets within the line.",
    	flavor: "Turns out the zombies have a weakness to being lit on freakin' fire."
    };
    var items = {
    	snack: snack,
    	energydrink: energydrink,
    	adrenaline: adrenaline,
    	bandage: bandage,
    	firstaidkit: firstaidkit,
    	medkit: medkit,
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
    	knife: knife,
    	baton: baton,
    	baseballbat: baseballbat,
    	crowbar: crowbar,
    	machete: machete,
    	sword: sword,
    	combatknife: combatknife,
    	katana: katana,
    	axe: axe,
    	chainsaw: chainsaw,
    	lawnmower: lawnmower,
    	handgun: handgun,
    	uzi: uzi,
    	revolver: revolver,
    	crossbow: crossbow,
    	shotgun: shotgun,
    	autoshotgun: autoshotgun,
    	magnum: magnum,
    	assaultrifle: assaultrifle,
    	snipperrifle: snipperrifle,
    	bow: bow,
    	machinegun: machinegun,
    	flamethrower: flamethrower
    };

    var itemtemplates = /*#__PURE__*/Object.freeze({
        __proto__: null,
        snack: snack,
        energydrink: energydrink,
        adrenaline: adrenaline,
        bandage: bandage,
        firstaidkit: firstaidkit,
        medkit: medkit,
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
        knife: knife,
        baton: baton,
        baseballbat: baseballbat,
        crowbar: crowbar,
        machete: machete,
        sword: sword,
        combatknife: combatknife,
        katana: katana,
        axe: axe,
        chainsaw: chainsaw,
        lawnmower: lawnmower,
        handgun: handgun,
        uzi: uzi,
        revolver: revolver,
        crossbow: crossbow,
        shotgun: shotgun,
        autoshotgun: autoshotgun,
        magnum: magnum,
        assaultrifle: assaultrifle,
        snipperrifle: snipperrifle,
        bow: bow,
        machinegun: machinegun,
        flamethrower: flamethrower,
        'default': items
    });

    const templates = itemtemplates;
    const acceptedFields = (()=>{ //get acceptable params - the key of the field in card. Note we use the field key NOT the field ID!
        let result = [];
        for (let key in fields){
            if (key == 'actions') continue; //ignore actions

            result.push(key);

            if ('max' in fields[key] && fields[key].max == true) result.push(key + '_max'); //add max fields 
        }
        return result;
    })();


    function handlePickup(character, args){
        
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
            return {msg: `${character.get('name')} picked up a(n) ${item["name"] || 'Item'}`, type:"success"};
        } else {
            return {msg: "Error: Invalid item or no arguments provided.", type: "error"}
        }
    }


    function createInventoryItem(character, item){
        var rowId = generateRowID();

        for (let key in item){

            //Don't handle max fields - max needs to be set as a property of an attribute
            if (key.endsWith('_max')){
                continue;
            }

            let fld = fields[key]; //get original field
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

    function handleAttack(character, args){

        if (!("rolls" in args)){
            return {msg: "You must specify the number of rolls!", type:"error"};
        }

        if (!("dice" in args)){
            return {msg: "You must specify the dice roll!", type:"error"};
        }

        
        let amount = args['rolls'];
        let msgText = '';
        let type='success';

        if ("resource" in args){
            let resources = spendResource(args['rolls'], args['resource'], character);
            
            if (!resources){
                return {msg: "Could not spend resource!", type:"error"};
            }

            amount = resources.spent;
            msgText = `${character.get('name')} spent ${amount} ${args['resource']}!`;

            if (resources.exhausted){
                msgText += `${character.get('name')} has run out of ${args['resource']}`;
                type = 'warning';
            } else {
                msgText += `${character.get('name')} has ${resources.remaining} ${args['resource']} remaining!`;
            }

        }

        let rollText = generateRollText(amount, args['dice']);

        return {msg: msgText, roll: rollText, type:type};
    }


    function generateRollText(amount, dice){

        let rollText = '';

        //generate rolltext in the form of {{dice,dice,dice}}
        for (let i = 0; i < amount; i++){
            rollText += dice;

            if (i < amount - 1){
                rollText += ',';
            }
        }

        return `{{${rollText}}}`;
    }


    function spendResource(amount, resource, character){
        let attr = getAttr(character, resource);

        if (!attr || !Number.isInteger(amount)){
            log(resource);
            log(attr);
            return null;
        }

        let current = attr.get('current'),
            newVal = Math.floor( current - amount, 0);

        
        attr.setWithWorker({current: newVal});

        return {
            spent: current - newVal,
            exhausted: (newVal == 0),
            remaining: newVal
        }
    }

    var Main = Main || (function(){
        const HandleInput = function(msg) {

            if (msg.type !== "api"){
                return;
            }

            //Initial Validation
            const args = splitArgs(msg.content),
                sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
                character = getCharacter(sender, msg, args);

            if (!character){
                sendMessage("You must select a valid character that you control!", sender, 'error');
                return;
            }

            // Reload
            if (msg.content.startsWith("!!reload")){
                if (!("weapon" in args)){
                    sendMessage('You must specify a valid weapon (i.e. weapon=1  or weapon=2, etc)', sender, 'error');
                    return
                }

                const response = handleReload(character, args.weapon);

                sendMessage(response.msg, "Reload Script", response.type);
                return;
            }


            //Pickup
            if (msg.content.startsWith("!!pickup")){
                const response = handlePickup(character, args);

                sendMessage(response.msg, "Pickup Script", response.type);
                return;
            }


            //attack
            if (msg.content.startsWith("!!attack")){
                const response = handleAttack(character, args);

                if ('roll' in response){
                    sendChat('Attack Script', `${character.get('name')} makes an attack!`);
                    sendChat('Attack Script', `/roll ${response.roll}`);
                }

                if (response.msg){
                    sendMessage(response.msg, 'Attack Script', response.type);
                }

            }
        };
        
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
            }

            sendChat(
                `${who}`,
                `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;">${msg}</div>`
    		);
        };
        
        const RegisterEventHandlers = function() {
    		on('chat:message', HandleInput);
            on('change:attribute', attrAlert);
    	};

        return {
            RegisterEventHandlers: RegisterEventHandlers
        }
    })();
    on("ready", function(){
        Main.RegisterEventHandlers();
    });

})();
