var Pickup = Pickup || (function() {
    'use strict';
    const ITEM_TEMPLATES = (([[runFunction((data)=>{
            let misc = require('./data/itemtemplates-misc.json'),
                armor = require('./data/itemtemplates-armor.json'),
                weapon = require('./data/itemtemplates-weapons.json');

            return Object.assign({}, misc, armor, weapon);
        })
    ]]));

    const DURABILITY_FIELD = "(([[searchProperty('canonical', 'meleeDurability', 'items').attr_name]]))";
    const AMMO_FIELD = "(([[searchProperty('canonical', 'rangedAmmo', 'items').attr_name]]))";
    const REACH_FIELD = "(([[searchProperty('canonical', 'meleeRange', 'items').attr_name]]))";
    const RANGE_FIELD = "(([[searchProperty('canonical', 'rangedRange', 'items').attr_name]]))";
    const HAS_MAX = [DURABILITY_FIELD, AMMO_FIELD];
    const INVENTORY_PREFIX = "(([[getProperty('prefixes.inventory')]]))";
    const INVENTORY_ATTR = "repeating_inventory";

    const ARG_SHORTHAND = {
        name: "(([[getProperty('items.fields.name')]]))",
        type: "(([[getProperty('items.fields.type')]]))",
        weight: "(([[getProperty('items.fields.weight')]]))",
        quantity: "(([[getProperty('items.fields.quantity')]]))",
        note: "(([[getProperty('items.fields.description')]]))",
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
    splitArgs = (([[getFunction('splitArgs')]])),
    getCharacter = (([[getFunction('getCharacter')]])),
    attrLookup = (([[getFunction('attrLookup')]])),
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