var Attack = Attack || (function() {
    'use strict';
    const  fields = [[{dataquery:'attackFields'}]],
        strengthAttr = "[[{attrlookup:'strength'}]]",
        dextAttr = "[[{attrlookup:'dexterity'}]]",
        energyStat = "[[{attrlookup:'energy'}]]",
        meleeHitRoll = "[[{attrlookup:'meleehitroll'}]]",
        rangedHitRoll = "[[{attrlookup:'rangedhitroll'}]]",
        rangedPrefix ="[[{prefix:'eq_ranged'}]]",
        meleePrefix = "[[{prefix:'eq_melee'}]]",
        weaponNameField = "[[{attrlookup:'itemname'}]]",

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


        if (!character){
            return;
        }

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
            hitRoll =  ( (args.type == "melee") ? (parseInt(getAttrByName(character.id, meleeHitRoll), 10)) : (parseInt(getAttrByName(character.id, rangedHitRoll))) ) || 10,
            hitBonus = parseInt(args.bonus,10) || 0,
            prefix = args.type == "melee" ? meleePrefix : rangedPrefix,
            weaponName =getAttrByName(character.id, prefix + "_" + weaponNameField) || '', //set this here out of laziness, this gets used in outputAttack
            baseDifficulty = (args.difficulty == "0") ? 0 : ((parseInt(args.difficulty,10) * 3) || 3),
            inputFields = makePrefixedObject(prefix, fields.weaponFields),
            attackResult = null;
        
        try{
            attackResult = calculateAttack(inputFields, character.id, args.type, numAttacks, hitRoll, hitBonus, baseDifficulty)

        } catch(e){
            sendMessage(`The following error occurred while calculating your ${args.type} attack. Please make sure all the sheet fields are entered properly with the correct format and try again. <br/><br/>'${e}'`, sender, true, "danger");
            log(`Error when making a ${args.type} attack by ${sender}`);
        }
        
        
        if (attackResult) {
            try {
                attrLookup(character, attackResult.resourceType).setWithWorker({current: (attackResult.startingResource - attackResult.resourceUsed)});
    
                if (args.type == "melee"){
                    attrLookup(character, `${meleePrefix}_${fields.weaponFields.durability}`).setWithWorker({current: (attackResult.startingDurability - attackResult.durabilityLost)});
                }
            } catch(e){
                sendMessage(`The following error occurred while subtracting resources for your ${args.type} attack. The resource was ${attackREsult.resourcetype}, the starting amount was ${attackResult.startingResource} and the spent amount was ${attackResult.resourceUsed}. <br/><br/>'${e}'`, sender, true, "danger");
                log(`Error when subtracting a ${args.type} attack by ${sender}`);
            }

            outputAttack(attackResult, character.get('name'), sender, args.type, weaponName);
            
            try{
                //For Debugging 
                if ("debug" in args && args.debug == true){
                    log("------Debug---------");
                    log("args:");
                    log(args);
                    log("fields:");
                    log(fields);
                    log("numAttacks: " + numAttacks);
                    log("hitRoll: " + hitRoll);
                    log("hitBonus: " + hitBonus);
                    log("prefix: " + prefix);
                    log("baseDifficulty: " + baseDifficulty);
                    log("attackResult: ");
                    log(attackResult);
                }
                
                //For testing results
                if ("test" in args && args.test == true){
                    log("------Test---------");
                    log(attackResult);
                    log(`Total Damage: ${attackResult.finalDamage}`);
                    log(`Total Hit Bonus: ${attackResult.attrBonus + attackResult.profBonus + hitBonus}`);
                    log(`Resource Spent: ${attackResult.resourceUsed}`);
                    log(`Durability Lost: ${attackResult.durabilityLost}`);
                    log(`Exhausted: ${attackResult.exhausted}`);
                    log(`Weapon Break: ${attackResult.weaponBroken}`);
                    
                    var critCount = 0,
                        failCount = 0,
                        regHitCount = 0,
                        regMissCount = 0;
    
                    for (const atk of attackResult.rolls){
                        if (atk.atkCrit){
                            critCount++;
                        } else if (atk.atkFail){
                            failCount++;
                        } else if (atk.atkHit && !atk.atkCrit){
                            regHitCount++;
                        } else if (!atk.atkHit && !atk.atkFail){
                            regMissCount++;
                        }
                    }
    
                    log(`Number of Critical Hits: ${critCount}`);
                    log(`Number of Critical Fails: ${failCount}`);
                    log(`Regular Hits: ${regHitCount}`);
                    log(`Regular Misses: ${regMissCount}`);
                }
            } catch(e){
                sendMessage(`Debug/Test Error. <br/><br/>'${e}'`, sender, true, "danger");
                log(`Error during debug/test - ${e}`);
            }
        }
    },
    calculateAttack = function(fields, id, type, numAttacks, hitRoll, hitBonus, baseDifficulty) {
        
        var isMelee = (type === "melee"),
            currResource = isMelee ? parseInt(getAttrByName(id, energyStat), 10) : parseInt(getAttrByName(id, fields.ammo), 10), //energy or ammo
            damageDice = isMelee ? parseDamageDice(getAttrByName(id, fields.meleedamage)) : parseDamageDice(getAttrByName(id, fields.rangeddamage)), //melee or ranged dmg
            attrHitBonus = isMelee ? getAttrModAndBonus(strengthAttr, id, true) : getAttrModAndBonus(dextAttr, id, true), //add str/dext to attack
            resourceCost = ( isMelee ? parseInt(getAttrByName(id, fields.meleecost), 10) : 1) || 1, //energy cost or 1
            typeProf = ( isMelee ? getAttrByName(id, fields.meleetype) : getAttrByName(id, fields.rangedtype) ), //get the weapon type value
            profBonus =  getAttrModAndBonus(typeProf, id, false), //The weapon type value equals a proficiency attr, so we can use that in getAttrByName
            durability = parseInt(getAttrByName(id, fields.durability), 10) || 0,
            critBonus = ( isMelee ? parseInt(getAttrByName(id, fields.meleecrit), 10) : parseInt(getAttrByName(id, fields.rangedcrit), 10) ) || 1,
            resourceUsed = 0,
            finalDamage = 0,
            durabilityLost = 0,
            attackResult = {
                type: type,
                resourceType: isMelee ? energyStat : fields.ammo,
                baseDifficulty: baseDifficulty,
                numAttacks: numAttacks,
                hitRoll: hitRoll,
                hitBonus: hitBonus,
                attrBonus: attrHitBonus,
                profBonus: profBonus,
                startingResource: currResource,
                startingDurability: durability,
                damageDice: damageDice,
                critBonus: critBonus,
                resourceCost: resourceCost,
                weaponBroken: false,
                exhausted: false,
                rolls: []
            };

        // Required fields for calculating an attack. Other ones have a default value. 
        if ( isNaN(currResource) || isNaN(attrHitBonus) || damageDice === null) {
            log(`======================= Attack Script Error =====================`);
            log(`One of the required fields for an attack was invalid.`);
            log(`Current Resource: ${currResource}`);
            log(`Attr Hit Bonus: ${attrHitBonus}`);
            log(`Damage Dice: ${damageDice}`);
            throw `One of the required fields for a ${type} attack was empty or incorrectly entered.`;
        } 
        
        //Per Attack
        for (let i = 0; i < numAttacks; i++){
            
            /*** Check and calculate Resources *******/
            if (currResource < resourceCost ){
                attackResult.exhausted = true;     
                break;
            }

            if (isMelee && (durability <= 0 || attackResult.weaponBroken)){
                attackResult.weaponBroken = true;
                break;
            }

            resourceUsed += resourceCost;
            currResource -= resourceCost;

            /****** calculate roll and difficulty. ******/
            let attack = {},
                roll = randomInteger(hitRoll),
                difficulty = baseDifficulty + (randomInteger(3));

            //Store results
            attack.hitRollRaw = roll;
            attack.hitRollTotal = roll + hitBonus + attrHitBonus + profBonus;
            attack.difficulty = difficulty;
    

            /****** calculate hit and crit ******/
            if ( roll >= 10){//crit if nat 10 and above
                attack.atkCrit = true;
                attack.atkHit = true;
                attack.atkFail = false;
                attack.hitRollTotal = roll;
            } else if (roll == 1){//miss
                attack.atkHit = false;
                attack.atkCrit = false;
                attack.atkFail = true;
                if (isMelee) {
                    durabilityLost++;
                    if (durabilityLost >= durability){
                        attackResult.weaponBroken = true; // this stops the loop after the next iteration.
                    }
                }
            } else {//hit
                attack.atkCrit = false;
                attack.atkFail = false;
                ( attack.hitRollTotal >= difficulty) ? attack.atkHit = true : attack.atkHit = false; //meets it, beats it
                
            }

            /****** Calculate Damage *******/
            if (attack.atkHit){
                /** Note on parsed dice
                 * [0] - full match [1d6+3>2]
                 * [1] - amount of dice (1) (optional, defaults to 1)
                 * [2] - the dice [d6] (required)
                 * [3] - dice bonus [+3] (optional)
                 * [4] - dice mins, if present [>2] (optional)
                 */

                var numRolls = parseInt(damageDice[1], 10) || 1,
                    dmgRoll = parseInt(damageDice[2], 10) || null,
                    dmgBonus = parseInt(damageDice[3], 10) || 0,
                    dmgMin = parseInt(damageDice[4], 10) || 0,
                    atkDmg = 0,
                    atkRolls = [];
                
                //one final check for roll, in case parseInt does something weird. 
                if (dmgRoll == null) {
                    log(`======================= Attack Script Error =====================`);
                    log(`No Damage Roll was found.`);
                    throw `The damage roll set for a ${type} attack could not be parsed.`;
                }

                if (attack.atkCrit){
                    numRolls = numRolls + (critBonus * numRolls);
                }

                while (atkDmg == 0 || atkDmg < dmgMin) {
                    atkDmg = 0;
                    atkRolls = [];

                    for (let j = 0; j < numRolls; j++){
                        let damage = randomInteger(dmgRoll);
                        atkDmg += damage;
                        atkRolls.push(damage);
                    }
                }

                attack.totalDamage = atkDmg + dmgBonus;
                attack.rawDamage = atkDmg;
                attack.damageRolls = atkRolls;
                finalDamage += attack.totalDamage;
            } else {
                attack.totalDamage = 0;
                attack.rawDamage = 0;
                attack.damageRolls = [];
            }
            /*** Finalize this Attack and add to result. Go to next loop iteration. */
            attackResult.rolls.push(attack);
        }

        //Summary numbers
        attackResult.finalDamage = finalDamage;
        attackResult.resourceUsed = resourceUsed;
        attackResult.durabilityLost = durabilityLost;
        return attackResult;
    },
    /**
     * Output the results of the attack into chat.
     */
    outputAttack = function(attack, name, sender, type, weaponName=''){
        var outputText = `${name} makes a ${type} attack with ${weaponName.length > 0 ? `their ${weaponName}` : 'their weapon'}\
        <h3>Rolls</h3> \n`;//need line break to append roll templates

        //Can't output rolltemplate and regular text in the same message
        for (let i = 0; i < attack.rolls.length; i++){
            let atk = attack.rolls[i],
            hitresult = atk.atkCrit ? 'crit' : (atk.atkFail ? 'fail' : (atk.atkHit ? 'hit' : 'fail')),
            hitdescript = hitresult.charAt(0).toUpperCase() + hitresult.slice(1),
            difficulty = atk.difficulty,
            attrType = (type == 'melee') ? 'str' : 'dext',
            damage = attack.finalDamage,
            dmgDescript = atk.damageRolls.map((x) => {return `[[${x}]]`}).join('+') + (attack.damageDice[3] !== null ? attack.damageDice[3] : ''),
            
            difficultyDescript = `[[${difficulty}]]${attack.attrBonus == 0 ? '' : `${attack.attrBonus > 0 ? ' + ' : ' - '}${attack.attrBonus}(${attrType})`}${attack.profBonus == 0 ? '' : `${attack.profBonus > 0 ? ' + ' : ' - '}${attack.profBonus}(prof)`}${attack.hitBonus == 0 ? '' : `${attack.hitBonus > 0 ? ' + ' : ' - '}${attack.hitBonus}(bonus)`}\ `;
            
            outputText += ` &{template:attackresult} {{attackNo=${i+1}} {{hitStyle=${hitresult}}} {{hitRoll=${atk.hitRollRaw}}} {{hitDescript=${hitdescript}}} {{difficulty=${atk.difficulty}}} {{difficultyDescript=${difficultyDescript}}} {{damage=${atk.totalDamage}}} {{damageDescript=${dmgDescript}}} \n `;//need a line break at the end
        }
        
        
        outputText += `<div style="border: solid 1px lightgray; padding: 1px 3px; background: white">\
        <h4>Attack Summary</h4>\
        ${attack.weaponBroken && type == "melee" ? `<div style="color:red"> The weapon was broken!</div>` : ''}\
        ${attack.exhausted ? `<div style="color:red"> ${name} is out of ${ (type === 'melee') ? 'energy' : 'ammo'}!</div>` : ''}\
        <div>Total Damage: <strong>${attack.finalDamage}</strong></div>\
        <div>${ (type === 'melee') ? 'Energy' : 'Ammo'} Spent: <strong>${attack.resourceUsed}</strong></div>\
        ${(type === 'melee') ? `<div>Durability Lost:  <strong>${attack.durabilityLost}</strong></div>` : ''}\
        </div>`;
        

        sendChat(
            `ZnZ - ${type.charAt(0).toUpperCase() + type.slice(1)} Attack Script`,
            outputText
        );

        },
        /**
         * Regex parse a VERY basic dice expression specific for the type of dice expressions needed for an attack roll in this game.
     * You can specify number of dice, the dice roll, any dice bonus and a roll minimum.
     * 
     * Regex has 4 capturing groups. This function would return an array such as the following:
     * Example: 1d6+3>2
     * [0] - the full match of the roll (1d6+3>2)
     * [1] - amount of dice (1) (optional, defaults to 1)
     * [2] - the dice [d6] (required)
     * [3] - dice bonus [+3] (optional)
     * [4] - dice mins, if present [>2] (optional)
     */
    parseDamageDice = function(diceExp) {
        const expr = diceExp.trim().replace(/\s/g,''), //get rid of all whitespace for easier processing
            diceRegex = /([\d]*?)?(?:[dD])([\d]*)([\+\-]\d*)?(?:[>])?(\d*)?/;

        let match = diceRegex.exec(expr);
        
        if (match == null || match.length < 5 || match[2] == null){
            log(`Invalid Dice Regex! Got: ${match} from ${diceExp}`);
            return null;
        }

        return match;

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
    //Takes chat input and split it into args using a '=' to denote an argument in the form of [arg]=[value]
    //Example: in "!!attack type=melee attacks=3", there is a 'type' arg which is equal to 'melee' and an 'attacks' arg equal to '3'
    splitArgs = function(input) {
        var arr = input.split(' '),
            result = {},
            argsRegex = /(.*)=(.*)/; //can't be global but shouldn't need it as we are splitting args. 
            
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
    //Gets a Attrs mod and its bonus together
    getAttrModAndBonus = function(attr, id, appendMod){
        if (appendMod == true){
            var attrMod = attr + '_mod'; //some have _mod, some don't. so we use this in the first getAttr since bonus never has _mod
        } else {
            var attrMod = attr;
        }
        
        return (parseInt(getAttrByName(id, attrMod), 10) || 0) 
             + (parseInt(getAttrByName(id, attr + "_bonus"), 10) || 0);

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