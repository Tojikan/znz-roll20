var Zroll = Zroll || (function() {
    'use strict';


    const HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }

        if (!msg.content.startsWith("!!zroll")){
            return;
        }

        let sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            character = getCharacter(sender, msg),
            args = splitArgs(msg.content);

        /////////// Validations
        
        
        // Help flag.
        if ("help" in args && args['help'] == true){
            sendMessage('***Z-Roll Help *** <br/>' + 
            '**How to Roll** <br/> Specify a number of dice to roll. <div>!!zroll 3 - roll 3d10</div> <div>!!zroll 5 - roll 5 times</div>' +
            '**Roll and spend energy**'
            , sender, true);
            return;
        }

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
     */
    RollHandler = function(args, char, sender){
        var args = args,
            char = char,
            sender = sender,
            diceAmount = parseInt(args[1], 10),
            rollArray = doRoll(diceAmount),
            rollMessage = `Z-Rolling ${diceAmount}d10!`,
            hasError = false;


        // Resource Spending
        let resourceTypes = (([[transformData('resource', (data) => {
            return data.filter((x)=>{return (x.attr_name !== 'exp')})
            .map((x)=>{ return x.attr_name});
        })]]));
        
        if ("resource" in args && resourceTypes.includes(args['resource'])){
            spendResource(args['resource']);
        } else {
            for (let res of resourceTypes){
                if (res in args && args[res] == true){
                    spendResource(res);
                }
            }
        }

        function spendResource(res){

            if (char == null){
                sendMessage('You must select a token in order to spend a resource!', 'sender', true, "danger");
                hasError = true;
                return;
            }

            let currentResource = (parseInt(getAttrByName(char.id, res)) || 0);

            if (currentResource == 0){
                rollMessage += `<div style="color:red">${char.get('name')} has 0 ${capitalizeWord(res)}!</div>`
                diceAmount = 0;
                rollArray = [];
            } else if (currentResource < diceAmount){
                log('original:' + rollArray.length);
                rollMessage += `<div style="color:red">${char.get('name')} ran out of ${capitalizeWord(res)} and could only roll ${currentResource} times!</div>`
                rollArray = rollArray.slice(0, currentResource);
                diceAmount = currentResource;
                log('new:' + rollArray.length);
            } else if (currentResource == diceAmount){
                rollMessage += `<div style="color:red">${char.get('name')} has spent all of their ${capitalizeWord(res)}!</div>`
            } else {
                rollMessage += `<div>${char.get('name')} spends ${diceAmount} ${capitalizeWord(res)}!</div>`
            }

            let newResource = (currentResource - diceAmount > 0 ? (currentResource - diceAmount) : 0);

            let attr = attrLookup(res, char.id);

            if (attr){
                attr.setWithWorker({current: newResource});
            }
        }

        function addAttrBonus(){

        }

        function useAmmo(){

        }

        function useDurability(){

        }
            
        function handleRoll(){
            if (!hasError){
                sendMessage(`<span style="font-weight: 900; font-size: 14px;">${rollMessage}</span> <br/><br/> ${displayRoll(rollArray)}`, sender, false);
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
                text += `<span style='${rollStyle}'>${roll.roll}</span>`;
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
    /**
     * If token is selected and the character is controlled by player, returns the character.
     */
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
            if( !validatePlayerControl(character, msg.playerid)) {
                return null;
            }

        } else{
            return null;
        }

        return character;

    },
    capitalizeWord = function(word){
        if (typeof word !== 'string'){
            return ''
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    },
    attrLookup = function(name, id){
        return findObjs({type: 'attribute', characterid: id, name: name})[0];
    },
    validatePlayerControl = function(character, playerId){
        return playerIsGM(playerId) ||  
        _.contains(character.get('controlledby').split(','),playerId) || 
        _.contains(character.get('controlledby').split(','),'all');
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
