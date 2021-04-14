/**
 * Z Roll - handles rolling for all attacks, skill checks, etc.
 */

var Zroll = Zroll || (function() {
    'use strict';

    const RANGED_AMMO_ATTR = "equipped_ranged_ranged_ammo";
    const MELEE_DURABILITY_ATTR = "equipped_melee_melee_durability";


    const HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }

        if (!msg.content.startsWith("!!zroll")){
            return;
        }

        let sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            args = splitArgs(msg.content),
            character = getCharacter(sender, msg, args); //Selected character only required for attribute/resource rolls
            
        // Help flag.
        if (("help" in args) || Object.keys(args).length == 1 || ("1" in args && args["1"] == "help")){
            let attributeArray = ["strength","dexterity","constitution","athletics","intelligence","tenacity","perception","charisma"];
            
            let message = '***Z-Roll Help *** <br/>' + 
            '**How to Roll** <br/> Specify a number of dice to roll. <div>*!!zroll 3 - roll 3d10*</div> <div>*!!zroll 5 - roll 5d10*</div><br/>Every Crit adds an additional roll and every Fail adds a negative roll.<br/><br/>' +
            '**Flags**<br/> Adding the following flags to the roll command to add an effect for each dice that is rolled. <br/>Example: *!!zroll 3 --energy --durability* <br/> <br/>' +
            '*--energy*: Spend energy equal to number of rolls. <br/>' +
            '*--sanity*: Spend sanity equal to number of rolls. <br/>' +
            '*--health*: Spend health equal to number of rolls. <br/>' +
            '*--ammo*: Spend ranged weapon ammo equal to number of rolls. <br/>' +
            '*--durability*: Spend melee weapon durability equal to number of rolls. <br/><br/>';
            for (let attr of attributeArray){
                message += `*--${attr}*: Add ${attr} modifier and bonus to each roll. <br/>`;
            }
            
            sendMessage(message, sender, true);
            return;
        }
            
        /////////// Validations

        //Check we have number of dice to roll.
        if (!("1" in args)){
            sendMessage('You must specify a number of dice to roll (example: !!zroll 5)', sender, true, 'danger');
            return;
        } 

        //Validate number of dice.
        let diceRoll = parseInt(args[1], 10);
        if (isNaN(diceRoll)){
            sendMessage('Error! You have specified a non-number for number of dice to roll.', sender, true, 'danger');
            return;
        } else if (diceRoll < 0){
            sendMessage('Error! You have specified a negative number of dice to roll', sender, true, 'danger');
            return;
        }
        
        RollHandler(args, character, sender).handleRoll();

    },
    /**
     * Closure to handle processing a roll.
     * - Roll is done at the closure start.
     * - Then handleResource/handleAttribute is called for spending resource/adding attribute bonuses if certain args are passed in.
     */
    RollHandler = function(args, char, sender){
        // Roll Scoped variables - accessible by all functions in the handler.
        // Uses _CamelCase to differentiate and prevent accidental changes.
        var _Args = args,
            _Char = char,
            _Sender = sender,
            _NumberOfDice = parseInt(_Args[1], 10),
            _RollArray = doRoll(_NumberOfDice), 
            _RollMessage = `Z-Rolling ${_NumberOfDice}d10!<br/><br/>`,
            _HasError = false;


        /**
         * Handler for resource spending
         */
        function handleResource(){
            // Energy, Sanity, Health
            const resourceTypes = ["health","sanity","energy"];

    
            //If resource is input as either resource={res} or --res
            for (let res of resourceTypes){
                if (("resource" in _Args && _Args['resource'] == res )||(res in _Args && _Args[res] == true)){
                    spendResource(res);
                }
            }
            
            // Ammo
            if (("resource" in _Args && _Args['resource'] == 'ammo' )||('ammo' in _Args && _Args['ammo'] == true)){
                spendResource(RANGED_AMMO_ATTR, "Ammo");
            }
            // Durability
            if (("durability" in _Args && _Args['resource'] == 'durability' )||('durability' in _Args && _Args['durability'] == true)){
                spendResource(MELEE_DURABILITY_ATTR, "Weapon Durability");
            }
        }

        /**
         * Action for resource spending
         */
        function spendResource(resourceAttr, resourceText = ''){
            if (_Char == null){
                sendMessage(`You must select a token in order to spend ${resourceText}!`, sender, true, "danger");
                _HasError = true;
                return;
            }

            if (!resourceText.length){
                resourceText = capitalizeWord(resourceAttr);
            }

            let currentResource = (parseInt(getAttrByName(_Char.id, resourceAttr)) || 0);

            if (currentResource == 0){
                _RollMessage += `<div style="color:red">${_Char.get('name')} has 0 ${resourceText}!</div><br/>`

                //Clear roll if no resource
                _NumberOfDice = 0;
                _RollArray = [];
            } else if (currentResource < _NumberOfDice){
                _RollMessage += `<div style="color:red">${_Char.get('name')} ran out of ${resourceText} and could only roll ${currentResource} times!</div><br/>`

                //Remove rolls if ran out of resource
                _RollArray = _RollArray.slice(0, currentResource);
                _NumberOfDice = currentResource;
            } else if (currentResource == _NumberOfDice){
                //Nothing changes, just add text if uses all remaining. 
                _RollMessage += `<div style="color:red">${_Char.get('name')} has used all of their remaining ${resourceText}!</div><br/>`
            } else {
                _RollMessage += `<div>${_Char.get('name')} uses ${_NumberOfDice} ${resourceText}!</div><br/>`
            }

            let newResource = (currentResource - _NumberOfDice > 0 ? (currentResource - _NumberOfDice) : 0);

            let attr = attrLookup(resourceAttr, _Char.id);

            if (attr){
                attr.setWithWorker({current: newResource});
            }
        }

        /**
         * Handler for adding attribute bonus
         */
        function handleAttribute(){
            const attributes = ["strength","dexterity","constitution","athletics","intelligence","tenacity","perception","charisma"];
            
            for (let attr of attributes){
                if (("attribute" in _Args && _Args['attribute'] == attr) || (attr in _Args && _Args[attr] == true)){
                    addAttributeBonus(attr);
                }
            }
        }
        
        /**
         * Action for adding attribute bonus
         */
        function addAttributeBonus(attr){
            if (_Char == null){
                sendMessage(`You must select a token in order to add an attribute to your roll!`, sender, true, "danger");
                _HasError = true;
                return;
            }

            var attrMod = parseInt(getAttrByName(_Char.id, attr + "_mod"), 10) || 0,
                attrBonus = parseInt(getAttrByName(_Char.id, attr + "_bonus"), 10) || 0;

            for (let roll of _RollArray){
                roll.roll += (attrMod + attrBonus);
            }

            _RollMessage += `<div>${_Char.get('name')} adds their ${capitalizeWord(attr)} (${attrMod + attrBonus}) to each roll!</div><br/>`;
        }
            
        function handleRoll(){
            handleResource();
            handleAttribute();
            if (!_HasError){
                sendMessage(`<span style="font-weight: 900; font-size: 14px;">${_RollMessage}</span> <br/> ${displayRoll(_RollArray)}`, _Sender, false);
            }
        }

        return {
            handleRoll: handleRoll
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
            `${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:6px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 14px;"><div style="font-size:20px; margin-bottom: 10px;"><strong>Z-Roll</strong></div>${message}</div>`
		);
    },
    RegisterEventHandlers = function() {
		on('chat:message', HandleInput);
    };
    
    return {
		RegisterEventHandlers: RegisterEventHandlers
	};
})();

on("ready",function(){
	'use strict';
	Zroll.RegisterEventHandlers();
});
