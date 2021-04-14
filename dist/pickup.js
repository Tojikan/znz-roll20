var Pickup = Pickup || (function() {
    'use strict';
    const ITEM_TEMPLATES = {"blunt1":{"item_type":"melee","item_name":"Blunt 1","item_weight":2,"item_quantity":1,"melee_damage":"2-4","melee_reach":1,"melee_durability":15,"melee_type":"blunt"},"blunt2":{"item_type":"melee","item_name":"Blunt 2","item_weight":3,"item_quantity":1,"melee_damage":"4-6","melee_reach":1,"melee_durability":30,"melee_type":"blunt"},"blunt3":{"item_type":"melee","item_name":"Blunt 3","item_weight":4,"item_quantity":1,"melee_damage":"6-8","melee_reach":1,"melee_durability":45,"melee_type":"blunt"},"blunt4":{"item_type":"melee","item_name":"Blunt 4","item_weight":6,"item_quantity":1,"melee_damage":"8-10","melee_reach":1,"melee_durability":75,"melee_type":"blunt"},"sharp1":{"item_type":"sharp","item_name":"Sharp 1","item_weight":1,"item_quantity":1,"melee_damage":"3-6","melee_reach":1,"melee_durability":10,"melee_type":"sharp"},"sharp2":{"item_type":"sharp","item_name":"Sharp 2","item_weight":3,"item_quantity":1,"melee_damage":"5-8","melee_reach":1,"melee_durability":20,"melee_type":"sharp"},"sharp3":{"item_type":"sharp","item_name":"Sharp 1","item_weight":4,"item_quantity":1,"melee_damage":"7-10","melee_reach":1,"melee_durability":30,"melee_type":"sharp"},"sharp4":{"item_type":"sharp","item_name":"Sharp 4","item_weight":5,"item_quantity":1,"melee_damage":"9-13","melee_reach":1,"melee_durability":40,"melee_type":"sharp"}};

    const DURABILITY_FIELD = "melee_durability";
    const AMMO_FIELD = "ranged_ammo";
    const REACH_FIELD = "melee_reach";
    const RANGE_FIELD = "ranged_range";
    const HAS_MAX = [DURABILITY_FIELD, AMMO_FIELD];
    const INVENTORY_PREFIX = "inventory";
    const INVENTORY_ATTR = "repeating_inventory";

    const ARG_SHORTHAND = {
        name: "{"attr_name":"item_name","display_name":"Name"}",
        type: "{"attr_name":"item_type","display_name":"Type","type":"select","default":"misc","options":"itemTypes"}",
        weight: "{"attr_name":"item_weight","display_name":"Weight"}",
        quantity: "{"attr_name":"item_quantity","display_name":"Quantity"}",
        note: "{"attr_name":"item_description","display_name":"Description"}",
        damage: "damage",
        range: "",
        uses: "",
        max: ""
    }

    HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }
        
        if (!msg.content.startsWith("!!pickup")){
            return;
        }

        var sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            character = getCharacter(sender, msg),
            args = splitArgs(msg.content);

        if (!character){
            sendMessage("You must select your character's token to pick up an item!", sender, true, "danger");
            return;
        }

        let itemValues = convertToInventoryItem(args);
        createNewItemRow(itemValues, character);
        sendMessage(`${character.get('name')} picked up ${itemValues.item_quantity || 1} ${itemValues.item_name}(s)`, sender, false, "info");

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
        
        //Get fields and values from templates based on item arg
        if ("item" in args && args["item"] in ITEM_TEMPLATES) {
            let name = args["item"];
            var template = ITEM_TEMPLATES[name];
            
            for (let prop in template) {
                retVal[prop] = template[prop];
                
                if (HAS_MAX.includes(prop)){
                    retVal[prop + "_max"] = template[prop];
                }
            }
            
            //Get fields and values from args.
            const argKeys = Object.keys(args);
            for (let key of argKeys){
                //apply shorthand to args.
                if (key in ARG_SHORTHAND){

                    let type = ("item_type" in retVal) ? retVal.item_type : "";

                    switch (key){
                        case "damage":
                            if (type == 'melee' || 'ranged'){
                                retVal[type + "_" + damage] = args[key];
                            }
                            break;
                        case "uses":
                            if (type == 'melee'){
                                retVal[DURABILITY_FIELD] = args[key];
                                retVal[DURABILITY_FIELD + "_MAX"] = args[key];
                            } else if (type == 'ranged'){
                                retVal[AMMO_FIELD] = args[key];
                                retVal[AMMO_FIELD + "_MAX"] = args[key];
                            }
                            break;
                        case "max":
                            if (type == 'melee'){
                                retVal[DURABILITY_FIELD + "_MAX"] = args[key];
                            } else if (type == 'ranged'){
                                retVal[AMMO_FIELD + "_MAX"] = args[key];
                            }
                        case "range":
                            if (type == 'melee'){
                                retVal[REACH_FIELD] = args[key];
                            } else if (type == 'ranged'){
                                retVal[RANGE_FIELD] = args[key];
                            }
                        default:
                            // shared fields across items.
                            retVal[ARG_SHORTHAND[key]] = args[key];
                    }

                }
            }
            return retVal;
        }
    }
    /**
     * Constructs a new attribute object from itemValues, and then creates it. This assumes it is creating for a repeating field section and so it'll generate a row ID.
     * 
     * @param itemValues - object where each key is the field attr_name and the value is the value to set the field to.
     * @param character - selected Character. Just need id.
     */
    createNewItemRow = function(itemValues, character) {
        var newRowId = generateRowID();

        for (let field in itemValues) {
            if (itemValues.hasOwnProperty(field)) {

                //Don't individually handle max fields since max can be set as property when creating a new attribute.
                //It won't work if you individually create an Obj for a max
                if(field.endsWith("_max")){
                    continue;
                }

                var attr = {};
                attr.name = INVENTORY_ATTR + "_" + newRowId + "_" + INVENTORY_PREFIX + "_" + field;
                attr.current = itemValues[field];
                attr.characterid = character.id;

                createObj("attribute", attr);
            }
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
    attrLookup = function(name, id){
        /**Get Roll20 Attr */
        return findObjs({type: 'attribute', characterid: id, name: name})[0];
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
            'ZnZ Script - Pickup',
            `${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;"><div style="font-size:20px; margin-bottom:10px"><strong>PickUp Item Script</strong></div>${message}</div>`
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