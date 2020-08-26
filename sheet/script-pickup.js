var Pickup = Pickup || (function() {
    'use strict';
    const templates = {"snacks":{"item_name":"Snacks","item_type":"misc","item_weight":0.5,"item_quantity":1,"item_effect":"Consume to restore 5 energy during a rest."},"meal":{"item_name":"Meal","item_type":"misc","item_weight":1,"item_quantity":1,"item_effect":"Consume to restore 10 energy during a rest."},"bandages":{"item_name":"Bandages","item_type":"misc","item_weight":0.5,"item_quantity":1,"item_effect":"Use to restore 5 health during a rest."},"painkillers":{"item_name":"painkillers","item_type":"misc","item_weight":0.1,"item_quantity":1,"item_effect":"Use to restore 2 health. Can be taken outside a rest. Consuming more than 4 a day can cause negative side effects."},"firstaidkit":{"item_name":"First Aid Kit","item_weight":"1","item_quantity":"1","item_type":"misc","item_effect":"Use to restore 10 health during a rest.","melee_type":"prof_blunt_melee","melee_durability":1,"melee_energy_cost":1,"melee_damage":"1d2","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_ammo_max":1,"ranged_reloads":0,"ranged_damage":"1d2","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":6},"alcohol":{"item_name":"Alcohol","item_weight":"0.5","item_quantity":"1","item_type":"misc","item_effect":"Consume to restore 5 sanity during a rest. Having more than one within a short time period can cause attribute penalties.","melee_type":"prof_blunt_melee","melee_durability":1,"melee_energy_cost":1,"melee_damage":"1d4","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_ammo_max":1,"ranged_reloads":0,"ranged_damage":"1d4","ranged_crit_bonus":1,"weapon_range":4,"weapon_range_max":8},"ducttapearmor":{"item_name":"Duct Tape Armor","item_weight":"1","item_quantity":"1","item_type":"body","equipment_dmg_reduce":1,"equipment_stat_0":"dexterity","equipment_stat_0_mod":-1},"footballpads":{"item_name":"Football Pads","item_weight":"1","item_quantity":"1","item_type":"body","equipment_dmg_reduce":2,"equipment_stat_0":"dexterity","equipment_stat_0_mod":-1},"bicyclehelmet":{"item_name":"Bicycle Helmet","item_weight":"1","item_quantity":"1","item_type":"head","equipment_dmg_reduce":1},"footballhelmet":{"item_name":"Football Helmet","item_weight":"1","item_quantity":"1","item_type":"head","equipment_dmg_reduce":2,"equipment_stat_0":"dexterity","equipment_stat_0_mod":-1},"blunt1":{"item_type":"melee","item_name":"Blunt Weapon 1","item_weight":1,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":4,"melee_durability_max":4,"melee_energy_cost":1,"melee_damage":"1d4+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d4+1","ranged_crit_bonus":1,"weapon_range":4,"weapon_range_max":8},"blunt2":{"item_type":"melee","item_name":"Blunt Weapon 2","item_weight":2,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":8,"melee_durability_max":8,"melee_energy_cost":1,"melee_damage":"1d6+2","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d6+2","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":6},"sharp1":{"item_type":"melee","item_name":"Sharp Weapon 1","item_weight":1,"item_quantity":1,"melee_type":"prof_sharp_melee","melee_durability":2,"melee_durability_max":2,"melee_energy_cost":1,"melee_damage":"1d6+2","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d6+2","ranged_crit_bonus":1,"weapon_range":4,"weapon_range_max":8},"sharp2":{"item_type":"melee","item_name":"Sharp Weapon 2","item_weight":2,"item_quantity":1,"melee_type":"prof_sharp_melee","melee_durability":4,"melee_durability_max":4,"melee_energy_cost":1,"melee_damage":"1d8+2","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d8+2","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":6},"heavy1":{"item_type":"melee","item_name":"Heavy Weapon 1","item_weight":3,"item_quantity":1,"melee_type":"prof_heavy_melee","melee_durability":3,"melee_durability_max":3,"melee_energy_cost":2,"melee_damage":"1d10+1>3","melee_crit_bonus":2,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d10+1","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":6},"heavy2":{"item_type":"melee","item_name":"Heavy Weapon 1","item_weight":4,"item_quantity":1,"melee_type":"prof_heavy_melee","melee_durability":5,"melee_durability_max":5,"melee_energy_cost":3,"melee_damage":"1d12+1>4","melee_crit_bonus":2,"weapon_reach":1,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d12+1","ranged_crit_bonus":2,"weapon_range":2,"weapon_range_max":4},"long1":{"item_type":"melee","item_name":"Long Reach 1","item_weight":2,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_durability_max":2,"melee_energy_cost":1,"melee_damage":"1d6+1","melee_crit_bonus":1,"weapon_reach":2,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d6+1","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":5},"long2":{"item_type":"melee","item_name":"Long Reach 2","item_weight":3,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":3,"melee_durability_max":3,"melee_energy_cost":1,"melee_damage":"1d8+2","melee_crit_bonus":1,"weapon_reach":2,"ranged_type":"prof_throwing","ranged_ammo":1,"ranged_reloads":0,"ranged_damage":"1d8+1","ranged_crit_bonus":1,"weapon_range":2,"weapon_range_max":4},"pistol1":{"item_type":"ranged","item_name":"Pistol 1","item_weight":2,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d3+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_handguns","ranged_ammo":7,"ranged_reloads":2,"ranged_damage":"1d6+1","ranged_crit_bonus":1,"weapon_range":6,"weapon_range_max":12},"pistol2":{"item_type":"ranged","item_name":"Pistol 2","item_weight":3,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d3+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_handguns","ranged_ammo":10,"ranged_reloads":2,"ranged_damage":"1d8+1>2","ranged_crit_bonus":1,"weapon_range":6,"weapon_range_max":12},"revolver1":{"item_type":"ranged","item_name":"Revolver 1","item_weight":2,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d3+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_handguns","ranged_ammo":4,"ranged_reloads":3,"ranged_damage":"1d7+2","ranged_crit_bonus":2,"weapon_range":4,"weapon_range_max":8},"revolver2":{"item_type":"ranged","item_name":"Revolver 2","item_weight":3,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d3+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_handguns","ranged_ammo":6,"ranged_reloads":3,"ranged_damage":"1d10+2>3","ranged_crit_bonus":2,"weapon_range":4,"weapon_range_max":8},"shotgun1":{"item_type":"ranged","item_name":"Shotgun 1","item_weight":2,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d6+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_shotguns","ranged_ammo":5,"ranged_reloads":2,"ranged_damage":"4d3+2","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":6},"shotgun2":{"item_type":"ranged","item_name":"Shotgun 2","item_weight":4,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d6+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_shotguns","ranged_ammo":5,"ranged_reloads":1,"ranged_damage":"4d4+3","ranged_crit_bonus":1,"weapon_range":3,"weapon_range_max":5},"rifle1":{"item_type":"ranged","item_name":"Rifle 1","item_weight":2,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d6+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_rifles","ranged_ammo":8,"ranged_reloads":0,"ranged_damage":"1d8+1","ranged_crit_bonus":1,"weapon_range":6,"weapon_range_max":12},"rifle2":{"item_type":"ranged","item_name":"Rifle 2","item_weight":4,"item_quantity":1,"melee_type":"prof_blunt_melee","melee_durability":2,"melee_energy_cost":1,"melee_damage":"1d6+1","melee_crit_bonus":1,"weapon_reach":1,"ranged_type":"prof_rifles","ranged_ammo":10,"ranged_reloads":0,"ranged_damage":"1d10+2","ranged_crit_bonus":2,"weapon_range":6,"weapon_range_max":12}},
    //How args translate to itemfields
    argOptions = {"name":"item_name","weight":"item_weight","quantity":"item_quantity","type":"item_type","note":"item_note","effect":"item_effect","melee_type":"melee_type","durability":"melee_durability","durability_max":"melee_durability_max","energy":"melee_energy_cost","melee_damage":"melee_damage","melee_crit":"melee_crit_bonus","reach":"weapon_reach","ranged_type":"ranged_type","ammo":"ranged_ammo","ammo_max":"ranged_ammo_max","reloads":"ranged_reloads","damage":"ranged_damage","ranged_crit":"ranged_crit_bonus","range":"weapon_range","range_max":"weapon_range_max","armor":"equipment_dmg_reduce","stat0":"equipment_stat_0","stat0mod":"equipment_stat_0_mod","stat1":"equipment_stat_1","stat1mod":"equipment_stat_1_mod","stat2":"equipment_stat_2","stat2mod":"equipment_stat_2_mod"},
    hasMaxField = ["melee_durability","ranged_ammo","weapon_range"],
    invPrefix = "inv",
    repeatingInv = "repeating_inventory",

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
            return;
        }

        //!!attack should be in 0. If not, they probably forgot to put a space between !!attack and an arg.
        if (!("0" in args)){
            sendMessage("Unspecified attack error. Did you forget to put a space somewhere?", sender, true, "danger");
            return; 
        };

        let itemValues = getNewItemFieldValuesFromArgs(args);
        createNewItemRow(itemValues, character);

    },
    /**
     * Takes the args that were entered into the chat and then tries to determine what values to set the new item's fields to.
     * Will also retrieve any templates. It is important that the template properties are field attr names.
     * 
     * @param args - the tokenized parameters passed into the API script from chat.
     * @returns object where each pair is the field attr_name and the value to set it to.
     */
    getNewItemFieldValuesFromArgs = function(args) {
        const argKeys = Object.keys(args);
        var ret = {};

        //Get fields and values from templates based on item arg
        if ("item" in args && args["item"] in templates) {
            let templateName = args["item"];
            var template = templates[templateName];

            for (let prop in template) {
                ret[prop] = template[prop];
            }
        }

        //Get fields and values from args.
        for (let key of argKeys){
            if (key in argOptions){ //the arg keys are shorthand for field names (notes = item_notes), so must retrieve the full field name from argOptions.
                ret[argOptions[key]] = args[key];
            }
        }
        return ret;
    },
    /**
     * Constructs a new attribute object from itemValues, and then creates it. This assumes it is creating for a repeating field section and so it'll generate a row ID.
     * 
     * @param itemValues - object where each key is the field attr_name and the value is the value to set the field to. Create from getNewItemFieldValuesFromArgs
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
                attr.name = repeatingInv + "_" + newRowId + "_" + invPrefix + "_" + field;
                attr.current = itemValues[field];
                attr.characterid = character.id;

                //Handle field with max
                var attrMax = field + "_max";
                if (attrMax in itemValues){ //if the max is specified in the args or the template, just pull that.
                    if (itemValues.hasOwnProperty(attrMax)){
                        attr.max = itemValues[attrMax];
                    }
                } else if (hasMaxField.includes(field)){ //if not specified but the field has a max, just set the max to current.
                    attr.max = attr.current;
                }


                createObj("attribute", attr);
            }
        }
    },
    /**
     * Output the results of the attack into chat.
     */
    outputAttack = function(attack, name, type, weaponName=''){
        
        const tableStyle = 'style="width:100%; text-align:center; margin-bottom: 10px;"',
            thStyle = 'style="text-align:center"',
            trStyle = 'style="margin-top: 10px; border-top: solid 1px #d3d3d3; border-bottom: solid 1px #d3d3d3"',
            tdStyle = 'vertical-align: top; padding: 10px;', //no style declaration
            divStyle = 'style="font-size: 21px; font-weight: 700; margin-bottom: 7px;"',
            rollStyle = 'style="border: solid 1px #d3d3d3; padding: 2px; background: white;"',
            msgStyle = 'style="border: solid 1px lightgray; padding: 1px 3px; background: white;"',
            wrapperStyle = 'style="border: solid 1px lightgray; padding: 3px;"',
            isMelee = (type == "melee"),
            typeText = isMelee ? 'Melee' : 'Ranged',
            attrType = isMelee ? 'Strength' : 'Dexterity',
            totalAttackBonus = attack.profBonus + attack.attrBonus + attack.hitBonus;

        var difficulty = ""
        switch(attack.baseDifficulty) {
            case 0:
                difficulty = "Easy";
                break;
            case 1:
                difficulty = "Medium";
                break;
            case 2:
                difficulty = "Hard";
                break;
            case 3:
                difficulty = "Insane";
                break;
            case 4:
                difficulty = "Impossible";
                break;
            default:
                difficulty = "Medium (Unk)"

        }
        
        var outputText = `\
        <h4>${typeText} Attack</h4>\
        <div>${name} tries to attack ${attack.numAttacks} time(s) with ${weaponName.length > 0 ? `their ${weaponName}` : 'their weapon'}</div><br/>\
        ${attack.reversed ? (isMelee ? `<div>${name} melee attacks with their ranged weapon!</div><br/>`: `<div>${name} throws their melee weapon!</div><br/>`) : '' }\
        <div>Difficulty: ${difficulty}</div><br/>\
        <div>Crit Multiplier: <strong>${attack.critBonus}x</strong></div>\
        <div style="margin-bottom: 10px;">${attrType} Bonus: <strong>${attack.attrBonus}</strong>  |  Proficiency Bonus: <strong>${attack.profBonus}</strong>  |  Misc Bonus: <strong>${attack.hitBonus}</strong>  |  Total Bonus: <strong>${totalAttackBonus}</strong></div>`;

        

        outputText += `<table ${tableStyle}><tr><th ${thStyle}>Hit</th><th ${thStyle}>Challenge</th><th ${thStyle}>Damage</th></tr> `;
        //Can't output rolltemplate and regular text in the same message
        for (let i = 0; i < attack.rolls.length; i++){
            let atk = attack.rolls[i],
            hitresult = atk.atkCrit ? 'Crit' : (atk.atkFail ? 'Fail' : (atk.atkHit ? 'Hit' : 'Miss')),
            hitstyle = atk.atkCrit ? 'color:#135314; background:#baedc3' : (atk.atkFail ? 'color:#791006; background:#FFCCCB' : (atk.atkHit ? 'background:#FFFFBF' : '')),
            difficulty = atk.difficulty,
            miniAttr = isMelee ? 'str' : 'dext',
            dmgDescript = atk.damageRolls.map((x)=>{return `<span ${rollStyle}>${x}</span>`}).join('+') + (attack.damageDice[3] && attack.damageDice[3] > 0 && atk.atkHit ? attack.damageDice[3] : ''),
            difficultyDescript = `<span ${rollStyle}>${difficulty}</span> ${totalAttackBonus == 0 ? '' : ` - ${totalAttackBonus}`}`;
            
            outputText += `<tr ${trStyle}>\
            <td style="${tdStyle} ${hitstyle}"><div ${divStyle}>${atk.hitRollRaw}</div> <div>${hitresult}</div></td>\
            <td style="${tdStyle}"><div ${divStyle}>${atk.difficulty - (attack.profBonus + attack.attrBonus + attack.hitBonus)}</div> <div style="font-size:11px;">${difficultyDescript}</div></td>\
            <td style="${tdStyle}"><div ${divStyle}>${atk.totalDamage}</div> <div style="font-size:11px;">${dmgDescript.length ? `(${dmgDescript})` : ''}</div></td>\
            </tr>`
        }
        outputText += '</table>';
        
        
        outputText += `\
        <div ${msgStyle}>\
        <h4>Attack Summary</h4>\
        ${attack.weaponBroken && isMelee ? `<div style="color:red"> The weapon was broken!</div>` : ''}\
        ${attack.exhausted ? `<div style="color:red"> ${name} is out of ${ isMelee ? 'energy' : 'ammo'}!</div>` : ''}\
        <div>Total Damage: <strong>${attack.finalDamage}</strong></div>\
        <div>${ isMelee ? 'Energy' : 'Ammo'} Spent: <strong>${attack.resourceUsed}</strong></div>\
        ${isMelee ? `<div>Durability Lost:  <strong>${attack.durabilityLost}</strong></div>` : ''}\
        </div>\ `;
        
        sendChat(
            `ZnZ - Attack Script`,
            `<div ${wrapperStyle}>${outputText}</div>`
        );

    },
    //takes an object and adds a prefix to each of its values.
    makePrefixedObject = function(prefix, obj){ 
        var result = {};

        for (const prop in obj){
            result[prop] = `${prefix}_${obj[prop]}`;
        }

        return result;
    },
    //Gets the character if a player sends a message while selecting a token AND they control the token. 
    getCharacter = function(sender, msg){
        let token,
            character = null;
        
        if ("selected" in msg){
            token = getObj('graphic', msg.selected[0]._id);

            if (token){
                character = getObj('character', token.get('represents'));
            }
        }

        //Validate player
        if (character){
            if( ! validatePlayerControl(character, msg.playerid)) {
                sendMessage('You do not control the selected character', sender, true, "danger");
                return null;
            }

        } else{
            sendMessage("You must select a token with a valid character sheet!", sender, true, "danger");
            return null;
        }

        return character;

    },

    /**
     * Tokenizes chat inputs for API commands
     * 
     * Step 1 - Splits chat by space unless the space is within single or double quotes.                                    Example: !example with 'text line' "hello world" gets split to ["!example", "with", "text line" "hello world"]
     * Step 2 - Tokenize everything into a Struct using a '=' to denote an argument in the form of [arg]=[value].           Example: !example test="hello world" is {0:"!example" test: "hello world"}
     * Step 2a - Everything to left of '=' becomes the key and everything to the right becomes the value
     * Step 2b - If no '=', the key is the array position of the split
     * Return the struct
     * 
     * There should not be spaces between '=' and the arg/value
     * 
     */
    splitArgs = function(input) {
        var result = {},
            argsRegex = /(.*)=(.*)/, //can't be global but shouldn't need it as we are splitting args. 
            quoteRegex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g; //Split on spaces unless space is within single or double quotes - https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli
        
            var quoteSplit = input.match(quoteRegex).map(e => {
                return e.replace(/['"]+/g, ''); //remove quotes
            });
    
            
        // This is our own code below for splitting along "="
        for (let i = 0; i < quoteSplit.length; i++){
            let match = argsRegex.exec(quoteSplit[i]); //Regex to match anything before/after '='. G1 is before and G2 is after

            if (match !== null) {
                let value = match[2];
                
                //Convert if types
                if ( !isNaN(value)){value = parseInt(match[2], 10)}
                if ( value === 'true'){value = true}
                if ( value === 'false'){value = false}

                result[match[1]] = value;
            } else {
                result[i] = quoteSplit[i];
            }
        }
        return result;
            
    },
    //get attr oject
    attrLookup = function(character, name){
        return findObjs({type: 'attribute', characterid: character.id, name: name})[0];
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
    validatePlayerControl = function(character, playerId){
        return playerIsGM(playerId) ||  
        _.contains(character.get('controlledby').split(','),playerId) || 
        _.contains(character.get('controlledby').split(','),'all');
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
            `${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;">${message}</div>`
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