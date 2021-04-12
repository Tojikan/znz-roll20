/**
 * Handles rolls for damage
 */
var DamageRoll = DamageRoll || (function() {
    'use strict';

    const RANGED_DAMAGE_ATTR = "equipped_ranged_ranged_damage";
    const MELEE_DAMAGE_ATTR = "equipped_melee_melee_damage";
    const STRENGTH_ATTR = "strength";
    
    // Aren't character attributes but will be used to denote special damage characteristics.
    const UNARMED_DAMAGE = "unarmed_damage";

    const HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }

        if (!msg.content.startsWith("!!damage")){
            return;
        }

        let sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            character = getCharacter(sender, msg),
            args = splitArgs(msg.content);

            
        // Help flag.
        if ("help" in args && args['help'] == true){
            let attributeArray = ["strength","dexterity","intelligence","perception","tenacity","charisma","luck"];
            
            let message = '***D-Roll Help *** <br/> Handles damage rolls. Requires an equipped melee/ranged weapon.' + 
            '**How to Roll** <br/> Specify a number of dice to roll. <div>!!damage 3 - roll damage 3 times.</div> <div>!!damage 5 - roll damaage 5 times</div>' +
            '**Flags**<br/> Adding the following flags to the roll command to add an effect for each dice that is rolled. <br/>Example: *!!zroll 3 --energy --durability <br/> <br/>' +
            '*--energy*: Spend energy. <br/>' +
            '*--sanity*: Spend sanity. <br/>' +
            '*--health*: Spend health. <br/>' +
            '*--ammo*: Spend ranged weapon ammo. <br/>' +
            '*--durability*: Spend melee weapon durability. <br/>';
            for (let attr of attributeArray){
                message += `*--${attr}*: Add ${attr} modifier and bonus. <br/>`;
            }
            
            sendMessage(message, sender, true);
            return;
        }
            
            
        /////////// Validations
        
        if (character == null){
            sendMessage(`You must select a token in order to roll damage!`, 'sender', true, "danger");
            return;
        }

        var type = "";

        if ("melee" in args || "m" in args){
            type = MELEE_DAMAGE_ATTR;
        } else if ("ranged" in args || "r" in args){
            type = RANGED_DAMAGE_ATTR;
        } else if ("unarmed" in args || "u" in args){
            type = UNARMED_DAMAGE;
        }

        if (!type.length){
            sendMessage(`You must specify either melee or ranged damage with '--melee' or '--ranged' flags!`, 'sender', true, "danger");
            return;
        }

        //Check we have number of dice to roll.
        if (!("1" in args)){
            sendMessage('You must specify a number of times to roll damage (example: !!damage 5)', sender, true, 'danger');
            return;
        } 

        //Validate number of dice.
        let diceRoll = parseInt(args[1], 10);
        if (isNaN(diceRoll)){
            sendMessage('Error! You have specified a non-number for number of times to roll damage.', sender, true, 'danger');
            return;
        } else if (diceRoll < 0){
            sendMessage('Error! You have specified a negative number of times to roll damage.', sender, true, 'danger');
            return;
        }

        DamageHandler(type, diceRoll, args, character, sender).handleDamage();

    },
    /**
     * Closure to handle processing damage.
     * - Type is the damage type character attr, determined at validation. 
     */
    DamageHandler = function(type, dice, args, char, sender){
        // Roll Scoped variables - accessible by all functions in the handler.
        // Uses _CamelCase to differentiate and prevent accidental changes.
        var _Type = type,
            _Args = args,
            _Char = char,
            _Sender = sender,
            _WeaponDamage = setDamage(),
            _NumOfAttacks = dice,
            _RollMessage = `${_Char.get('name')} attacks ${_NumOfAttacks}`,
            _HasError = false;
        
        /***
         * Get weapon damage.
         */
        function setDamage(){

            switch (_Type){
                case RANGED_DAMAGE_ATTR:
                case MELEE_DAMAGE_ATTR:
                    return getAttrByName(_Char.id, _Type);
                case UNARMED_DAMAGE:
                    return 1;
            };

            sendMessage(`Unknown type error`, 'sender', true, "danger");
            _HasError = true;
        }

        /**
         * Handler for adding attribute bonus
         */
        function handleAttribute(){
            const attributes = ["strength","dexterity","intelligence","perception","tenacity","charisma","luck"];
    
            for (let attr of attributes){
                if (("bonus" in _Args && _Args['bonus'] == attr) || (attr in _Args && _Args[attr] == true)){
                    addAttributeBonus(attr);
                }
            }
        }

        /**
         * Action for adding attribute bonus
         */
        function addAttributeBonus(attr){
            var attrMod = parseInt(getAttrByName(_Char.id, attr + "_mod"), 10) || 0,
                attrBonus = parseInt(getAttrByName(_Char.id, attr + "_bonus"), 10) || 0;

            for (let roll of _RollArray){
                roll.roll += (attrMod + attrBonus);
            }

            _RollMessage += `<div>${_Char.get('name')} adds their ${capitalizeWord(attr)} (${attrMod + attrBonus}) to each roll!</div>`;
        }
            
        function handleDamage(){
            handleAttribute();
            if (!_HasError){
                sendMessage(`<span style="font-weight: 900; font-size: 14px;">${_RollMessage}</span> <br/><br/> ${displayRoll(_RollArray)}`, _Sender, false);
            }
        }

        return {
            handleDamage: handleDamage
        }
    },
    /**
     * Returns an array of objects which represent an individual roll.
     * Each object contains:
     * - Roll - random number 1-10
     * - Crit - true if rolled 10
     * - Fail - true if rolled 1
     * - Bonus - Positive number if crit to be added to roll. Negative number if fail.
     */
    doRoll = function(num, bonus){
        var result = [];

        for (let i = 0; i < num; i++){
            let rollData = {},
                roll = randomInteger(10),
                crit = (roll == 10),
                fail = (roll == 1);
            
            rollData.roll = roll;
            rollData.crit = crit;
            rollData.fail = fail;

            if (crit){
                //Crit - adds up to 10
                let additional = randomInteger(10);
                rollData.bonus = additional;
            } else if (fail){
                //Fail - minuses minimum of 4.
                let additional = randomInteger(7) + 3;
                rollData.bonus = -(additional);
            } else {
                rollData.bonus = 0;
            }

            result.push(rollData);

        }
        return result;
    },
    /**
     * Turns a roll array into a chat message for display.
     */
    displayRoll = function(rollArray, result){
            var rollText = '<div style="line-height: 1.6; background: white; padding: 2px;">',
            finalStyle = 'font-weight: 900; font-size: 16px; padding: 3px; border:solid 1px black; background: yellow',
            critStyle = 'color: green;',
            failStyle = 'color: red;',
            rollStyle = 'font-size: 12px; border: solid 1px gray; padding:1px 2px;',
            result = calculateRoll(rollArray);


        for (let i = 0; i < rollArray.length; i++){
            let text = '',
                roll = rollArray[i];

            if (i != 0){
                text += ' + ';
            }
            
            if (roll.crit){
                text += `<span style='${rollStyle} ${critStyle}'>(${roll.roll} + ${roll.bonus})</span>`;
            } else if (roll.fail){
                text += `<span style='${rollStyle} ${failStyle}'>(${roll.bonus})</span>`
            } else {
                text += `<span style='${rollStyle} ${(roll.roll < 0) ? failStyle : ''}'>${roll.roll}</span>`;
            }

            rollText += text;
        }
        rollText += ` = <span style='${finalStyle}'>${result}</span></div>`

        return rollText;
    },
    /**
     * Calculates the result of a roll array
     */
    calculateRoll = function(rollArray){
        var final = 0;

        for (let roll of rollArray){
           if (roll.fail){
                final += roll.bonus;
            } else {
                //Bonus on regular rolls is 0
                final += roll.roll + roll.bonus; 
            }
        }

        return final;
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
    getCharacter = function(sender, msg){
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
    capitalizeWord = function(word){
        /**Capitalize First Letter */
        if (typeof word !== 'string'){
            return ''
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    },
    attrLookup = function(name, id){
        /**Get Roll20 Attr */
        return findObjs({type: 'attribute', characterid: id, name: name})[0];
    },
    getAttrModAndBonus = function(attr, id){
        //Get roll20 attr and any added on bonuses.
        var attrMod = attr + "_mod";
        var attrBonus = attr + '_bonus';
        
        return (parseInt(getAttrByName(id, attrMod), 10) || 0) 
                + (parseInt(getAttrByName(id, attrBonus), 10) || 0);

    },
    sendMessage = function(message, who, whisper, type="info" ) {
        var textColor = "#000000",
            bgColor = "#d3d3d3";
        
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
            'Z-Roll',
            `${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:6px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;">${message}</div>`
		);
    },
    RegisterEventHandlers = function(){
		on('chat:message', HandleInput);
    };
    
    return {
		RegisterEventHandlers: RegisterEventHandlers
	};
})();

on("ready",function(){
	'use strict';
	DamageRoll.RegisterEventHandlers();
});
