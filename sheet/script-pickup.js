var Pickup = Pickup || (function() {
    'use strict';
    const templates = '',

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

        log(args);


        if (!character){
            return;
        }

        //!!attack should be in 0. If not, they probably forgot to put a space between !!attack and an arg.
        if (!("0" in args)){
            sendMessage("Unspecified attack error. Did you forget to put a space somewhere?", sender, true, "danger");
            return; 
        };
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
     * First, splits a chat message by space unless the space is within single or double quotes.              Example: !example with 'text line' "hello world" gets split to ["!example", "with", "text line" "hello world"]
     * Then tokenize into a struct using a '=' to denote an argument in the form of [arg]=[value].            Example: !example test="hello world" is {0:"!example" test: "hello world"}
     * Everything to left of '=' becomes the key and everything to the right becomes the value
     * If no '=', the key is the array position of the split
     * There can't be spaces between the '=' and the args/values
     */
    splitArgs = function(input) {
        var arr = input.split(' '),
            result = {},
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