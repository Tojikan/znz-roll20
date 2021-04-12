/**
 * Handles rolls for damage
 */
var DamageRoll = DamageRoll || (function() {
    'use strict';

    const RANGED_DAMAGE_ATTR = "(([[getProperty('prefixes.ranged')]]))_(([[searchProperty('canonical', 'rangedDamage', 'items').attr_name]]))";
    const MELEE_DAMAGE_ATTR = "(([[getProperty('prefixes.melee')]]))_(([[searchProperty('canonical', 'meleeDamage', 'items').attr_name]]))";
    const STRENGTH_ATTR = "(([[searchProperty('canonical', 'str', 'attributes').attr_name]]))";
    
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
            let attributeArray = (([[transformData('attributes', (data) => {
                return data.map((x)=>{return x.attr_name});
            })]]));
            
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
            const attributes = (([[transformData('attributes', (data) => {
                return data.map((x)=>{return x.attr_name});
            })]]));
    
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
    splitArgs = (([[getFunction('splitArgs')]])),
    getCharacter = (([[getFunction('getCharacter')]])),
    capitalizeWord = (([[getFunction('capitalizeWord')]])),
    attrLookup = (([[getFunction('attrLookup')]])),
    getAttrModAndBonus = (([[getFunction('getAttrModAndBonus')]])),
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
