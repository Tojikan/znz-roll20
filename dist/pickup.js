var Pickup = Pickup || (function() {
    'use strict';
    const ITEM_TEMPLATES = {"medkit":{"item_type":"misc","item_name":"Medkit","item_weight":3,"item_quantity":1,"item_description":"Heals for 10 health."},"meal":{"item_type":"misc","item_name":"Cooked Meal","item_weight":1,"item_quantity":1,"item_description":"This nicely cooked meal restores 10 health."},"body1":{"item_type":"armor","item_name":"Body Armor 1","item_weight":3,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"","equipment_stat_bonus_0_mod":"","equipment_armor_rating":1,"armor_type":"body"},"body2":{"item_type":"armor","item_name":"Body Armor 2","item_weight":5,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"athletics","equipment_stat_bonus_0_mod":"-1","equipment_armor_rating":2,"armor_type":"body"},"body3":{"item_type":"armor","item_name":"Body Armor 3","item_weight":5,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"athletics","equipment_stat_bonus_0_mod":"-2","equipment_armor_rating":3,"armor_type":"body"},"body4":{"item_type":"armor","item_name":"Body Armor 4","item_weight":7,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"athletics","equipment_stat_bonus_0_mod":"-2","equipment_stat_bonus_1":"dexterity","equipment_stat_bonus_1_mod":"-1","equipment_armor_rating":4,"armor_type":"body"},"head1":{"item_type":"armor","item_name":"Helmet 1","item_weight":3,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"","equipment_stat_bonus_0_mod":"","equipment_armor_rating":1,"armor_type":"head"},"head2":{"item_type":"armor","item_name":"Helmet 2","item_weight":5,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"perception","equipment_stat_bonus_0_mod":"-1","equipment_armor_rating":2,"armor_type":"head"},"head3":{"item_type":"armor","item_name":"Helmet 3","item_weight":6,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"perception","equipment_stat_bonus_0_mod":"-2","equipment_armor_rating":3,"armor_type":"head"},"arms1":{"item_type":"armor","item_name":"Arm Guard 1","item_weight":2,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"","equipment_stat_bonus_0_mod":"","equipment_armor_rating":1,"armor_type":"arms"},"arms2":{"item_type":"armor","item_name":"Arm Guard 2","item_weight":3,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"dexterity","equipment_stat_bonus_0_mod":"-1","equipment_armor_rating":2,"armor_type":"arms"},"arms3":{"item_type":"armor","item_name":"Arm Guard 3","item_weight":3,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"dexterity","equipment_stat_bonus_0_mod":"-1","equipment_stat_bonus_1":"strength","equipment_stat_bonus_1_mod":"-1","equipment_armor_rating":3,"armor_type":"arms"},"legs1":{"item_type":"armor","item_name":"Leg Armor 1","item_weight":2,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"","equipment_stat_bonus_0_mod":"","equipment_armor_rating":1,"armor_type":"legs"},"legs2":{"item_type":"armor","item_name":"Leg Armor 2","item_weight":3,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"athletics","equipment_stat_bonus_0_mod":"-1","equipment_armor_rating":2,"armor_type":"legs"},"legs3":{"item_type":"armor","item_name":"Leg Armor 3","item_weight":4,"item_quantity":1,"item_description":"","equipment_stat_bonus_0":"athletics","equipment_stat_bonus_0_mod":"-2","equipment_armor_rating":3,"armor_type":"legs"},"blunt1":{"item_type":"melee","item_name":"Blunt 1","item_weight":2,"item_quantity":1,"item_description":"Good for playing whack-a-mole.","melee_damage":"2-4","melee_reach":1,"melee_durability":15,"melee_type":"blunt"},"blunt2":{"item_type":"melee","item_name":"Blunt 2","item_weight":3,"item_quantity":1,"item_description":"Good for knocking some heads around.","melee_damage":"4-6","melee_reach":1,"melee_durability":35,"melee_type":"blunt"},"blunt3":{"item_type":"melee","item_name":"Blunt 3","item_weight":4,"item_quantity":1,"item_description":"When you want to hit a home run with someone's undead head.","melee_damage":"6-8","melee_reach":1,"melee_durability":60,"melee_type":"blunt"},"blunt4":{"item_type":"melee","item_name":"Blunt 4","item_weight":6,"item_quantity":1,"item_description":"Let me be blunt, you're about to fuck some shit up.","melee_damage":"8-10","melee_reach":1,"melee_durability":75,"melee_type":"blunt"},"sharp1":{"item_type":"melee","item_name":"Sharp 1","item_weight":1,"item_quantity":1,"item_description":"Someone wants a very close shave.","melee_damage":"3-6","melee_reach":1,"melee_durability":10,"melee_type":"sharp"},"sharp2":{"item_type":"melee","item_name":"Sharp 2","item_weight":3,"item_quantity":1,"item_description":"This won't leave just a flesh wound.","melee_damage":"5-8","melee_reach":1,"melee_durability":20,"melee_type":"sharp"},"sharp3":{"item_type":"melee","item_name":"Sharp 3","item_weight":4,"item_quantity":1,"item_description":"Glorious Nippon Steel, folder over 1000 times.","melee_damage":"7-10","melee_reach":1,"melee_durability":30,"melee_type":"sharp"},"sharp4":{"item_type":"melee","item_name":"Sharp 4","item_weight":5,"item_quantity":1,"item_description":"Closest you can get to a lightsaber in the apocalypse.","melee_damage":"9-13","melee_reach":1,"melee_durability":40,"melee_type":"sharp"},"pistol1":{"item_type":"ranged","item_name":"Light Pistol","item_weight":3,"item_quantity":1,"item_description":"Pew Pew Pew.","ranged_damage":"4-7","ranged_range":5,"ranged_ammo":7,"ranged_type":"firearm","ranged_ammo_type":"ammo_light"},"pistol2":{"item_type":"ranged","item_name":"Medium Pistol","item_weight":5,"item_quantity":1,"item_description":"Standard Issue Zombie Killer","ranged_damage":"6-9","ranged_range":7,"ranged_ammo":12,"ranged_type":"firearm","ranged_ammo_type":"ammo_medium"},"pistol3":{"item_type":"ranged","item_name":"Pistol 3","item_weight":7,"item_quantity":1,"item_description":"So then I just started blasting.","ranged_damage":"8-12","ranged_range":8,"ranged_ammo":7,"ranged_type":"firearm","ranged_ammo_type":"ammo_heavy"},"revolver1":{"item_type":"ranged","item_name":"Revolver 1","item_weight":1,"item_quantity":1,"item_description":"Ultra-portable bullet shooter.","ranged_damage":"5-8","ranged_range":4,"ranged_ammo":4,"ranged_type":"firearm","ranged_ammo_type":"ammo_light"},"revolver2":{"item_type":"ranged","item_name":"Revolver 2","item_weight":3,"item_quantity":1,"item_description":"Do you feel lucky, punk?","ranged_damage":"7-11","ranged_range":5,"ranged_ammo":6,"ranged_type":"firearm","ranged_ammo_type":"ammo_medium"},"revolver3":{"item_type":"ranged","item_name":"Revolver 3","item_weight":5,"item_quantity":1,"item_description":"The Good, the Bad, and the likely-dead-once-this-hits-them.","ranged_damage":"10-14","ranged_range":5,"ranged_ammo":6,"ranged_type":"firearm","ranged_ammo_type":"ammo_heavy"},"smg1":{"item_type":"ranged","item_name":"SMG 1","item_weight":5,"item_quantity":1,"item_description":"Spray and Pray","ranged_damage":"3-7","ranged_range":6,"ranged_ammo":12,"ranged_type":"firearm","ranged_ammo_type":"ammo_light"},"smg2":{"item_type":"ranged","item_name":"SMG 2","item_weight":7,"item_quantity":1,"item_description":"Spray and Pray all Day","ranged_damage":"5-9","ranged_range":8,"ranged_ammo":15,"ranged_type":"firearm","ranged_ammo_type":"ammo_medium"},"shotgun1":{"item_type":"ranged","item_name":"Shotgun 1","item_weight":6,"item_quantity":1,"item_description":"The old classic","ranged_damage":"2-10","ranged_range":5,"ranged_ammo":5,"ranged_type":"firearm","ranged_ammo_type":"ammo_shells"},"shotgun2":{"item_type":"ranged","item_name":"Shotgun 2","item_weight":8,"item_quantity":1,"item_description":"Noob Cannon.","ranged_damage":"4-12","ranged_range":5,"ranged_ammo":7,"ranged_type":"firearm","ranged_ammo_type":"ammo_shells"},"shotgun3":{"item_type":"ranged","item_name":"Double Barreled Shotgun.","item_weight":8,"item_quantity":1,"item_description":"Kill in general direction.","ranged_damage":"8-20","ranged_range":4,"ranged_ammo":2,"ranged_type":"firearm","ranged_ammo_type":"ammo_shells"},"rifle1":{"item_type":"ranged","item_name":"Rifle 1","item_weight":6,"item_quantity":1,"item_description":"Take aim.","ranged_damage":"8-14","ranged_range":12,"ranged_ammo":5,"ranged_type":"firearm","ranged_ammo_type":"ammo_medium"},"rifle2":{"item_type":"ranged","item_name":"Rifle 2","item_weight":10,"item_quantity":1,"item_description":"Boom, Headshot.","ranged_damage":"10-16","ranged_range":15,"ranged_ammo":5,"ranged_type":"firearm","ranged_ammo_type":"ammo_heavy"},"ar1":{"item_type":"ranged","item_name":"Assault Rifle 1","item_weight":7,"item_quantity":1,"item_description":"Just holding it makes you feel bad-ass.","ranged_damage":"6-10","ranged_range":8,"ranged_ammo":12,"ranged_type":"firearm","ranged_ammo_type":"ammo_medium"},"ar2":{"item_type":"ranged","item_name":"Assault Rifle 2","item_weight":9,"item_quantity":1,"item_description":"This is my rifle. There are many others like it but this one is mine.","ranged_damage":"8-12","ranged_range":8,"ranged_ammo":15,"ranged_type":"firearm","ranged_ammo_type":"ammo_medium"},"bow1":{"item_type":"ranged","item_name":"Bow 1","item_weight":5,"item_quantity":1,"item_description":"You can use energy for each attack roll instead of ammo.","ranged_damage":"5-10","ranged_range":7,"ranged_ammo":1,"ranged_type":"projectile","ranged_ammo_type":"ammo_arrows"},"bow2":{"item_type":"ranged","item_name":"Bow 2","item_weight":5,"item_quantity":1,"item_description":"You can use energy for each attack roll instead of ammo.","ranged_damage":"7-12","ranged_range":8,"ranged_ammo":1,"ranged_type":"projectile","ranged_ammo_type":"ammo_arrows"},"crossbow1":{"item_type":"ranged","item_name":"Crossbow 1","item_weight":6,"item_quantity":1,"item_description":"Feed it a hammer, it'd crap out nails.","ranged_damage":"9-11","ranged_range":8,"ranged_ammo":3,"ranged_type":"projectile","ranged_ammo_type":"ammo_arrows"},"crossbow2":{"item_type":"ranged","item_name":"Crossbow 2","item_weight":8,"item_quantity":1,"item_description":"Little Ass-Kicker...That's a good name, right?","ranged_damage":"12-14","ranged_range":8,"ranged_ammo":3,"ranged_type":"projectile","ranged_ammo_type":"ammo_arrows"},"molotov":{"item_type":"ranged","item_name":"Molotov","item_weight":1,"item_quantity":1,"item_description":"Targets hit by this are set on fire and take 5 damage per round.","ranged_damage":"10","ranged_range":5,"ranged_ammo":1,"ranged_type":"throwing","ranged_ammo_type":"ammo_custom_0"},"grenade":{"item_type":"ranged","item_name":"Frag Grenade","item_weight":1,"item_quantity":1,"item_description":"","ranged_damage":"20-30","ranged_range":5,"ranged_ammo":1,"ranged_type":"throwing","ranged_ammo_type":"ammo_custom_0"}};

    const DURABILITY_FIELD = "melee_durability";
    const AMMO_FIELD = "ranged_ammo";
    const REACH_FIELD = "melee_reach";
    const RANGE_FIELD = "ranged_range";
    
    const HAS_MAX = [DURABILITY_FIELD, AMMO_FIELD];

    const INVENTORY_PREFIX = "inventory";
    const INVENTORY_ATTR = "repeating_inventory";

    const ITEM_QUANTITY = "item_quantity";
    const ITEM_NAME = "item_name";

    const ARG_SHORTHAND = {
        name: ITEM_NAME,
        type: "item_type",
        weight: "item_weight",
        quantity: ITEM_QUANTITY,
        note: "item_description",
        armor: "equipment_armor_rating",
        //Set individually based on item type.
        damage: "damage",
        range: "",
        uses: "",
        max: "",
        ammo: "ranged_ammo_type",
    };

    //Equipment stat mods
    const STAT_MOD = {"attr_name":"equipment_stat_bonus","display_name":"Equipment Stats","type":"stat_repeater","count":3,"canonical":"armorStatRepeater"};
    for (let i = 0; i < STAT_MOD.count; i++){
        ARG_SHORTHAND['stat' + i] = STAT_MOD.attr_name + "_" + i;
        ARG_SHORTHAND['stat' + i + "mod"] = STAT_MOD.attr_name + "_" + i + "_mod";
    }


    const HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }
        
        if (!msg.content.startsWith("!!pickup")){
            return;
        }

        var sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            args = splitArgs(msg.content),
            character = getCharacter(sender, msg, args);

        if (!character){
            sendMessage("You must select your character's token to pick up an item!", sender, true, "danger");
            return;
        }

        let itemValues = convertToInventoryItem(args);

        if (itemValues){
            createNewItemRow(itemValues, character);
            sendMessage(`${character.get('name')} picked up ${itemValues[ITEM_QUANTITY]} ${itemValues[ITEM_NAME]}(s)`, sender, false, "info");
        } else {
            sendMessage("Warning: Invalid item or no arguments provided.", sender, true, "danger");
        }
    },
    /**
     * Takes the args that were entered into the chat and then tries to determine what values to set the new item's fields to.
     * Will also retrieve any templates. It is important that the template properties are field attr names.
     * 
     * @param args - the tokenized parameters passed into the API script from chat.
     * @returns object where each pair is the field attr_name and the value to set it to.
     */
    convertToInventoryItem = function(args){
        var retVal = {};

        var itemTemplate = "";
        
        // Pull item template
        if ("item" in args && args["item"] in ITEM_TEMPLATES){
            itemTemplate = args["item"];
        } else if ("1" in args && args["1"] in ITEM_TEMPLATES){
            itemTemplate = args["1"];
        }

        if (itemTemplate.length){
            let template = ITEM_TEMPLATES[itemTemplate];
    
            for (let prop in template) {
                retVal[prop] = template[prop];
                
                if (HAS_MAX.includes(prop)){
                    retVal[prop + "_max"] = template[prop];
                }
            }
        }
        
        
        //Set manual type early, since that may affect other args.
        if ("type" in args){
            retVal[ARG_SHORTHAND["type"]] = args.type;
        } 
        
        //Manually set fields from args
        const argKeys = Object.keys(args);

        for (let key of argKeys){
            //apply shorthand to args.
            if (key in ARG_SHORTHAND){

                let type = ("item_type" in retVal) ? retVal.item_type : "";

                switch (key){
                    case "damage":
                        if (type == 'melee' || 'ranged'){
                            retVal[type + "_damage"] = args[key];
                        }
                        break;
                    case "uses":
                        if (type == 'melee'){
                            retVal[DURABILITY_FIELD] = args[key];
                            if (!args.hasOwnProperty("max")){
                                retVal[DURABILITY_FIELD + "_max"] = args[key];
                            }
                        } else if (type == 'ranged'){
                            retVal[AMMO_FIELD] = args[key];
                            if (!args.hasOwnProperty("max")){
                                retVal[AMMO_FIELD + "_max"] = args[key];
                            }
                        }
                        break;
                    case "max":
                        if (type == 'melee'){
                            retVal[DURABILITY_FIELD + "_max"] = args[key];
                        } else if (type == 'ranged'){
                            retVal[AMMO_FIELD + "_max"] = args[key];
                        }
                        break;
                    case "range":
                        if (type == 'melee'){
                            retVal[REACH_FIELD] = args[key];
                        } else if (type == 'ranged'){
                            retVal[RANGE_FIELD] = args[key];
                        }
                        break;
                    default:
                        // shared fields across items.
                        retVal[ARG_SHORTHAND[key]] = args[key];
                }

            }
        }

        if (Object.keys(retVal).length === 0){
            return null;

        } else {
            //Needed for message
            if (!(ITEM_QUANTITY in retVal)){
                retVal[ITEM_QUANTITY] = 1; 
            }
    
            if (!(ITEM_NAME in retVal)){
                retVal[ITEM_NAME] = 'items'; 
            }
    
    
            return retVal;
        }
    },
    /**
     * Constructs a new attribute object from itemValues, and then creates it. This assumes it is creating for a repeating field section and so it'll generate a row ID.
     * 
     * @param itemValues - object where each key is the field attr_name and the value is the value to set the field to.
     * @param character - selected Character. Just need id.
     */
    createNewItemRow = function(itemValues, character) {
        var newRowId = generateRowID();

        log(itemValues);

        for (let field in itemValues) {
            //Don't individually handle max fields since max can be set as property when creating a new attribute.
            //It won't work if you individually create an Obj for a max
            if(field.endsWith("_max")){
                continue;
            }

            var attr = {};
            attr.name = INVENTORY_ATTR + "_" + newRowId + "_" + INVENTORY_PREFIX + "_" + field;
            attr.current = itemValues[field] || '';
            attr.characterid = character.id;

            if (HAS_MAX.includes(field)){
                
                if (itemValues.hasOwnProperty(field + "_max")){
                    attr.max = itemValues[field+"_max"] || '';
                } else {
                    attr.max = attr.current;
                }
            }

            createObj("attribute", attr);
        }
    },
    /**
     * Generates a UUID for a repeater section, just how Roll20 does it in the character sheet.
     * https://app.roll20.net/forum/post/3025111/api-and-repeating-sections-on-character-sheets/?pageforid=3037403#post-3037403
     */
    generateUUID = function() { 
        "use strict";
    
        var a = 0, b = [];
        return function() {
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
        };
    }(),
    generateRowID = function () {
        "use strict";
        return generateUUID().replace(/_/g, "Z");
    },
    splitArgs = function(input) {
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
         */
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
                if ( !isNaN(value)){value = parseInt(match[2], 10)}
                if ( value === 'true'){value = true}
                if ( value === 'false'){value = false}

                result[match[1]] = value;
            } else if (quoteSplit[i].startsWith('--')) { //Handle Flags
                let flag = quoteSplit[i].substring(2);
                result[flag] = true;
            } else { //Default - array position
                result[i] = quoteSplit[i];
            }
        }
        return result;
    },
    getCharacter = function(sender, msg, args){
        /**
         * Returns character of selected token if it is controlled by selector.
         */
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

        } else{
            return null;
        }

        return character;
    },
    //generic message
    sendMessage = function(message, who, whisper, type="info" ) {
        let textColor = '#135314',
        bgColor = '#baedc3';

    
        switch (type) {
            case "danger":
                textColor = '#791006';
                bgColor = '#FFCCCB';
                break;
            case "warning":
                textColor = '#cd5b04';
                bgColor = '#FFFFBF';
                break;
        }

		sendChat(
            `${who}`,
            //broken on prod
            //`${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 14px;"><div style="font-size:20px; margin-bottom:10px"><strong>PickUp Item Script</strong></div>${message}</div>`
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 14px;"><div style="font-size:20px; margin-bottom:10px"><strong>PickUp Item Script</strong></div>${message}</div>`
		);
	},
    RegisterEventHandlers = function() {
		on('chat:message', HandleInput);
	};

	return {
		RegisterEventHandlers: RegisterEventHandlers
	};
}());


on("ready",function(){
	'use strict';
	Pickup.RegisterEventHandlers();
});