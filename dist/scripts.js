(function () {
	'use strict';

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	class Field$2 {
	    constructor(id, props={}, label='',){
	        this.id = id;
	        this.props = props;
	        this.label = label.length ? label : this.id.charAt(0).toUpperCase() + this.id.slice(1);
	    }

	    toJson(){
	        return {
	            id: this.id,
	            label: this.label,
	            ...this.props
	        }
	    }
	}


	var _field = Field$2;

	class FieldGroup$1 {
	    constructor(id, fields = []){
	        this.id = id;
	        this.fields = fields;
	    }

	    toJson(){
	        let result = {};

	        for (let fld of this.fields){
	            let fldjson = fld.toJson();
	            result[fldjson.id] = fldjson;
	        }

	        return result;
	    }
	}

	var _fieldGroup = FieldGroup$1;

	const Field$1 = _field;
	const FieldGroup = _fieldGroup;

	class SheetObject$1{
	    
	    constructor(fields){
	        this.fields = fields;
	    }

	    getFields = function(){
	        return this.fields.reduce((prev, cur)=>{
	            if (cur instanceof Field$1 || cur instanceof FieldGroup){
	                prev[cur.id] = cur.toJson();
	                return prev;
	            } else {
	                let combine = {...prev, ...cur};
	                return combine;
	            }
	             
	        }, {});
	    }
	}

	var _sheetObject = SheetObject$1;

	var id = "ability";
	var list = [
		{
			name: "",
			label: "",
			description: "",
			"default": true
		},
		{
			name: "cheerleader",
			label: "Cheerleader",
			description: "<strong>Action:</strong> Give all players within 5 spaces 1 bonus roll this turn."
		},
		{
			name: "brawler",
			label: "Brawler",
			description: "Add two free bonus dice to any melee attack."
		},
		{
			name: "builder",
			label: "Builder",
			description: "Roll a D10 on barricade rolls. Add 1 additional bonus dice."
		},
		{
			name: "doctor",
			label: "Doctor",
			description: "Roll a D10 on first aid rolls. Add 1 additional bonus dice"
		},
		{
			name: "gearhead",
			label: "Gearhead",
			description: "Start the game with 1 additional weapon, equipment, and inventory slot."
		},
		{
			name: "martial",
			label: "Martial Artist",
			description: " Start the game with bonus 3 defense."
		},
		{
			name: "scavenger",
			label: "Scavenger",
			description: "Draw 2 cards instead when you scavenge."
		},
		{
			name: "scout",
			label: "Scout",
			description: "<strong>Action</strong> Determine amount of enemies on other side of door."
		},
		{
			name: "sniper",
			label: "Sniper",
			description: "Add two free bonus dice to any ranged attacks."
		},
		{
			name: "speedy",
			label: "speedy",
			description: "Move additional 2 spaces during a move action."
		},
		{
			name: "sturdy",
			label: "sturdy",
			description: "Increase your starting health or your starting energy by 20."
		}
	];
	var abilities = {
		id: id,
		list: list
	};

	class Character extends _sheetObject{

	    constructor(character){
	        this.character;
	    }

	    static sheetObj = new _sheetObject(
	        [
	            new _field("name"),
	            new _field("ammo", {types:[
	                    "d4",
	                    "d6",
	                    "d8",
	                    "d10",
	                    "d12",
	                    "d20"
	                ]}),
	            new _fieldGroup('stats', [
	                new _field("health", {default: 30}),
	                new _field("energy", {default: 40}),
	            ]),
	            new _field('defense', {
	                    default: 5,
	                    bonus: true
	                } 
	            ),
	            new _field('ability',{
	                options: abilities
	            }),
	            new _fieldGroup('slots',[
	                new _field("weaponslots", {default: 1, max: 4, prefix:"weapon"}, 'Weapons'),
	                new _field("equipmentslots", {default: 2, max: 5, prefix:"equipment"}, 'Equipment'),
	                new _field("inventoryslots", {default: 5, max: 10, prefix:"inventory"}, 'Inventory')
	            ])
	        ]
	    );
	}


	const flds = Character.sheetObj.getFields();

	const fields = flds;

	var character = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Character: Character,
		fields: fields
	});

	function attrAlert(){

	    on("change:attribute", function(obj, prev){
	        //Key is the attribute name, value is the display name.

	        const watchedAttr = [
	            fields.stats.health.id,
	            fields.stats.energy.id,
	            fields.weaponslots.id,
	            fields.equipmentslots.id,
	            fields.inventoryslots.id
	        ];

	        for (let ammo of fields.ammo.types){
	            watchedAttr.push(`${fields.ammo.id}_${ammo}`);
	        }
	    
	    
	        if (obj.get("name") in watchedAttr){
	            attr = watchedAttr[obj.get("name")];
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
	            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')}'s ${attr} resource was changed!</strong><div> <div>Previous Value:  ${prevVal}</div><div> New Value: ${curVal} .</div></div>`
	        );
	    
	        if (curVal <= 0){
	            textColor = '#8B0000';
	            bgColor = '#FFA07A';
	            sendChat(
	                'Attribute Alert - Reached Zero!',
	                `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} reached 0 ${attr} points!</strong></div>`
	            );
	        }    
	    });
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
	 * Retrieve an attribute for a given character
	 * @param {*} character 
	 * @param {*} attribute 
	 * @returns The Attribute value
	 */
	var getAttrVal = function(character, attr){
	    return findObjs({type: 'attribute', characterid: character.id, name: attr})[0];
	};

	var require$$3 = /*@__PURE__*/getAugmentedNamespace(character);

	const Field = _field;
	const SheetObject = _sheetObject;
	const char = require$$3;

	const ammotypes = char.fields.ammo.types.map(x=> char.fields.ammo.id + '_' + x);

	class Card extends SheetObject{
	    static sheetObj = new SheetObject(
	        [
	            new Field(`name`, {input: 'text'}, 'Name'),
	            new Field(`type`,{
	                input: 'select',
	                options: [
	                    'consumable',
	                    'weapon',
	                    'equipment'
	                ],
	            }, "Item Type"),
	            new Field(`damage`, {only:'weapon', input:'dice'}, 'Damage'),
	            new Field(`weapontype`, {
	                only:'weapon',
	                input: 'select',
	                options: ['melee', 'ranged']
	            }, 'Weapon Type'),
	            new Field(`uses`, {
	                only:'weapon',
	                input: 'max',
	                max: 'uses_max',
	                text: {
	                    melee: 'Durability',
	                    ranged: 'Ammo'
	                }
	            }, 'Uses'),
	            new Field(`ammotype`, {
	                only:'weapon',
	                onselect: 'ranged',
	                input: 'select',
	                options:  ammotypes
	            }, 'Ammo Type'),
	            new Field(`description`, {input: 'textarea'}, 'Description'),
	            new Field(`effect`, {input: 'textarea'}, 'Effect'),
	            {
	                prefixes: {
	                    inv: "card",
	                    equip: "equipment",
	                    weapon: "weapon"
	                }
	            },
	            new Field('actions', {
	                drop:'dropItem', 
	                delete:'deleteItem',
	                attack:'attackWeapon',
	                reload: 'reloadWeapon',
	                equip: 'equipItem',
	                consume: 'consumeItem',
	                unequip: 'unequipItem'
	            }),
	            {prefix: 'item'}
	        ]
	    )
	}


	var card = {
	    fields: Card.sheetObj.getFields(),
	    actor: Card
	};

	function handleReload(character, weaponId){
	    const itemType = getAttrVal(character, getAttrName(card.fields.type.id, weaponId)),
	        weaponType = getAttrVal(character, getAttrName(card.fields.weapontype.id, weaponId)),
	        ammoType = getAttrVal(character, getAttrName(card.fields.ammotype.id, weaponId)),
	        ammo = getAttrVal(character, getAttrName(card.fields.uses.id, weaponId)),
	        ammoMax = ammo.get("max"),
	        ammoStore = getAttrVal(character, ammoType); //ammoType dropdown values are the attribute for the appropriate ammo store.
	    
	    if (itemType !== 'weapon'){
	        return {msg: "Item is not a weapon.", type: "error"};
	    } else if (weaponType !== 'ranged'){
	        return {msg: "Item is not a ranged weapon.", type: "error"};
	    } else if (!ammoType){
	        return {msg: "Could not get ammotype!", type: "error"};
	    } else if (!ammo){
	        return  {msg: "Could not get ammo!", type: "error"};
	    } else if (!ammoMax){
	        return  {msg: "Could not get max ammo!", type: "error"};
	    }


	    const current = parseInt(ammo.get('current'), 10) || 0,
	        max = parseInt(ammoMax, 10) || 0,
	        store = parseInt(ammoStore.get('current'), 10) || 0,
	        reload = max - current,
	        ammoText = ammoType.get('current').replace('ammo_', '');

	    if (current == max){
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

	const getAttrName = function(id, num){
	    return `weapon_${id}_${num}`;
	};

	var Main = Main || (function(){
	    const HandleInput = function(msg) {

	        if (msg.type !== "api"){
	            return;
	        }

	        const sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
	            character = getCharacter(sender, msg);

	        if (!character){
	            sendMessage("You must select a valid character that you control!", sender, true);
	        }

	        const args = splitArgs(msg.content);


	        if (msg.content.startsWith("!!reload")){
	            if (!"weapon" in args){
	                sendMessage('You must specify a valid weapon (i.e. weapon=1  or weapon=2, etc)', sender, 'error');
	            }

	            const response = handleReload(character, args.weapon);

	            sendMessage(response.msg, "Reload Script", msg.type);
	            return;
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
	                bgColor = '#EBC8C4';
	                textColor = '#465A3D';
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
