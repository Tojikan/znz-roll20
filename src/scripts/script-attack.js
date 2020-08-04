var Attack = Attack || (function() {
    'use strict';
    const  fields = [[{dataquery:'attackFields'}]],
    strengthAttr = "[[{attrlookup:'strength'}]]_mod",
    dextAttr = "[[{attrlookup:'dexterity'}]]_mod",
    energyStat = "[[{attrlookup:'energy'}]]",
    meleeHitRoll = "[[{attrlookup:'meleehitroll'}]]",
    rangedHitRoll = "[[{attrlookup:'rangedhitroll'}]]",
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
        log("new attack!");
        log(args);

        if (!("type" in args) || (args.type !== "melee" && args.type !== "ranged")){
            sendMessage("You must indicate if this is a melee or ranged attack in order to attack!", sender, true, "danger");
            return;
        }

        if (("difficulty" in args) && [0,1,2,3,4].indexOf(args.difficulty) == -1 ) {
            sendMessage("You have input an invalid difficulty level. Difficulty will now default to medium.", sender, true, "danger");
            args.difficulty = 1;
        }

        // Player Inputs
        var numAttacks = parseInt(args.attacks,10) || 1,
            hitbonus = parseInt(args.bonus,10) || 0,
            difficulty = (parseInt(args.difficulty,10) * 3) || 3,
            strength = (parseInt(getAttrByName(character.id, strengthAttr), 10)) || 0,
            dexterity = (parseInt(getAttrByName(character.id, dextAttr), 10)) || 0,
            rangedHit = (parseInt(getAttrByName(character.id, rangedHitRoll), 10)) || 10,
            meleeHit = (parseInt(getAttrByName(character.id, meleeHitRoll), 10)) || 10;

        log("numAttacks:" + numAttacks);
        log("hitbonus:" + hitbonus);
        log("difficulty:" + difficulty);
        
        log("strength: " + strength);
        log("dexterity: " + dexterity);
        log("rangedHit: " + rangedHit);
        log("meleeHit: " + meleeHit);

        for (let prof of fields.combatProfs) {
            log(prof + ": " + ( parseInt(getAttrByName(character.id, prof), 10) || 0));
        }

        meleeAttack(strength, dexterity, meleeHit, numAttacks, hitbonus, difficulty, character.id, makePrefixedObject(meleePrefix, fields.weaponFields));

    },
    meleeAttack = function(strength, dexterity, hit, numAttacks, hitbonus, baseDifficulty, id, fields){
        var currentEnergy = parseInt(getAttrByName(id, energyStat), 10) || null,
        meleeType = getAttrByName(id, fields.meleetype),
        profBonus = parseInt(getAttrByName(id, meleeType), 10) || 0, //this only works if the types dropdown's values === proficiency attrs
        energyCost = parseInt(getAttrByName(id, fields.meleecost), 10) || 1,
        damageDice = parseDamageDice(getAttrByName(id, fields.weapondamage)) || null,
        attackArr = [],
        energyUsed = 0,
        attackObj = {
            type: "melee",
            ranOut: false
        };
        
        // if (currentEnergy == null || isNaN(hit)){
        //     return null;
        // }
        
        // for (let atk = 0; atk < numAttacks; atk++){
            
        //     if (currentEnergy < energyCost){
        //         attackObj.ranOut = true;     
        //         break;
        //     }
            
        //     let attack = {},
        //         roll = randomInteger(hit);
        //         difficulty = baseDifficulty + (randomInteger(3)),

        //     attack.roll = roll;
        //     attack.difficulty = difficulty;
        //     energyUsed += energyCost;

        //     //calc crit
        //     if ( roll >= 10){
        //         attack.crit = true;
        //         attack.hit = true;
        //     } else {
        //         attack.crit = false;
        //         // calc hit
        //         ( ( roll + dexterity + hitbonus + profBonus ) >= difficulty) ? attack.hit = true : attack.hit = false;
        //     }

        //     //calculate damage
        //     if (attack.hit){


        //     } else {
        //         attack.damage = 0;
        //     }
        // }
    },
    //Parse a VERY basic dice expression. You can specify number of dice, the dice roll, any dice bonus and a brutal indicator
    //Example: 1d6+10 - G1 = 1, G2 = 6, G3 = +10
    //Example: 1d6+10>5 - G1 = 1, G2 = 6, G3 = +10, G4 = 5
    parseDamageDice = function(diceExp) {
        const expr = diceExp.trim().replace(/\s/g,''), //get rid of all whitespace for easier processing
            diceRegex = /([\d]*?)?(?:[dD])([\d]*)([\+\-]\d*)?(?:[>])?(\d*)?/;

        let match = diceRegex.exec(expr);
        log(match);

        return match;

    },
    //takes an object and adds a prefix to each of its values.
    makePrefixedObject = function(prefix, obj){ 
        var result = {};

        for (const prop in obj){
            result[prop] = `${meleePrefix}_${obj[prop]}`;
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
    //Takes chat input and split it into args using a '=' to denote an argument in the form of [arg]=[value]
    //Example: in "!!attack type=melee attacks=3", there is a 'type' arg which is equal to 'melee' and an 'attacks' arg equal to '3'
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