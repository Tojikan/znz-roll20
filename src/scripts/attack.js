var Attack = Attack || (function() {
    'use strict';
    const  fields = [[{dataquery:'attackFields'}]],
    strengthAttr = "[[{attrlookup:'strength'}]]",
    dextAttr = "[[{attrlookup:'dexterity'}]]",
    rangedPrefix ="[[{prefix:'eq_ranged'}]]",
    meleePrefix = "[[{prefix:'eq_melee'}]]",

    HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }
        
        if (!msg.content.startsWith("!!attack")){
            return;
        }

        var sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            character = getCharacter(sender, msg),
            args = splitArgs(msg.content);

        //!!attack should be in 0. If not, they probably forgot to put a space between !!attack and an arg.
        if (!("0" in args)){
            sendMessage("Unspecified attack error. Did you forget to put a space somewhere?", sender, true, "danger");
            return; 
        }

        //so we can use attackmelee or attackranged as a shorthand.
        if (args[0].indexOf('melee') > 0 && args[0].indexOf('ranged') > 0){
            sendMessage("You can't have it both ways", sender, true, "danger");
            return; 
        } else if (args[0].indexOf('melee') > 0){
            args.type = 'melee';
        } else if (args[0].indexOf('ranged') > 0) {
            args.type = 'ranged';
        }
        
        HandleAttack(sender,character,args);
    },
    HandleAttack = function(sender, character, args) {
        log(args);
        log("type" in args);

        if (!("type" in args) || (args.type !== "melee" && args.type !== "ranged")){
            sendMessage("You must indicate if this is a melee or ranged attack in order to attack!", sender, true, "danger");
            return;
        }

        if (("difficulty" in args) && [0,1,2,3,4].indexOf(args.difficulty) == -1 ) {
            sendMessage("You have input an invalid difficulty level. Difficulty will now default to medium.", sender, true, "danger");
            args.difficulty = 1;
        }

        // Player Inputs
        var numAttacks = args.attacks || 1,
            hitbonus = args.bonus || 0,
            difficulty = args.difficulty * 3 || 3;

    },
    getCharacter = function(sender, msg){
        let token,
            character = null;
        
        //Get character from sending player's selected token
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
    splitArgs = function(input) {
        var arr = input.split(' '),
            result = {};
        const argsRegex = /(.*)=(.*)/; //can't be global but shouldn't need it as we are splitting args. 
            
        for (let i = 0; i < arr.length; i++){
            let match = argsRegex.exec(arr[i]); //Regex to match anything before/after '='. G1 is before and G2 is after

            if (match !== null) {
                let value = match[2];
                
                //Convert if types
                if ( !isNaN(value)){value = parseInt(match[2], 10)}
                if ( value === 'true'){value = true}
                if ( value === 'false'){value = false}

                result[match[1]] = value;
            } else {
                result[i] = arr[i];
            }
        }
        return result;
            
    },
    attrLookup = function(character, name){
        return findObjs({type: 'attribute', characterid: character.id, name: name})[0];
    },
    validatePlayerControl = function(character, playerId){
        return playerIsGM(playerId) ||  
        _.contains(character.get('controlledby').split(','),playerId) || 
        _.contains(character.get('controlledby').split(','),'all');
    },
    sendMessage = function(message, who, whisper, type="info" ) {
        let textColor = '#006400',
            bgColor = '#98FB98';

        
        switch (type) {
            case "danger":
                textColor = '#8B0000';
                bgColor = '#FFA07A';
                break;
            case "warning":
                textColor = '#8B4513';
                bgColor = '#F0E68C';
                break;
        }


		sendChat(
            'ZnZ Action - Attack',
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
	Attack.RegisterEventHandlers();
});