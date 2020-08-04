var Attack = Attack || (function() {
    'use strict';
    const  fields = {"weaponFields":{"meleetype":"melee_type","durability":"melee_durability","meleecost":"melee_energy_cost","meleedamage":"melee_damage","meleecrit":"melee_crit_bonus","rangedtype":"ranged_type","ammo":"ranged_ammo","reloads":"ranged_reloads","rangeddamage":"ranged_damage","rangedcrit":"weapon_crit_bonus","range":"weapon_range"},"combatProfs":["prof_handguns","prof_shotguns","prof_rifles","prof_projectile","prof_throwing","prof_sharp_melee","prof_blunt_melee","prof_heavy_melee"]},
    strengthAttr = "strength_mod",
    dextAttr = "dexterity_mod",
    energyStat = "energy",
    meleeHitRoll = "melee_hit",
    rangedHitRoll = "ranged_hit",
    rangedPrefix ="equipped_ranged_weapon",
    meleePrefix = "equipped_melee_weapon",

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
            baseDifficulty = (parseInt(args.difficulty,10) * 3) || 3;

        log(calculateAttack(makePrefixedObject(meleePrefix, fields.weaponFields), character.id, args.type, numAttacks, hitRoll, hitBonus, baseDifficulty));
        // attrLookup(character,).setWithWorker({current: (attackResult.startingResource - attackResult.resourceUsed)});

    },
    calculateAttack = function(fields, id, type, numAttacks, hitRoll, hitBonus, baseDifficulty) {
        var currResource = (type === "melee") ? parseInt(getAttrByName(id, energyStat), 10) : parseInt(getAttrByName(id, field.ammo), 10), //energy or ammo
            damageDice = (type === "melee") ? parseDamageDice(getAttrByName(id, fields.meleedamage)) : parseDamageDice(getAttrByName(id, fields.rangeddamage)), //melee or ranged dmg
            attrHitBonus = (type === "melee") ? (parseInt(getAttrByName(id, strengthAttr), 10)) : (parseInt(getAttrByName(id, dextAttr), 10)), //add str/dext to attack
            resourceCost = ( (type === "melee") ? parseInt(getAttrByName(id, fields.meleecost), 10) : 1) || 1, //energy cost or 1
            typeProf = ( (type === "melee") ? getAttrByName(id, fields.meleetype) : getAttrByName(id, fields.rangedtype) ), //get the type
            durability = parseInt(getAttrByName(id, fields.durability), 10) || 1,
            profBonus =  parseInt(getAttrByName(id, typeProf)) || 0, //Get prof bonus. This only works if the weapon type dropdown values equals a proficiency attr.
            resourceUsed = 0,
            finalDamage = 0,
            durabilityLost = 0,
            attackResult = {
                type: type,
                hitBonus: hitBonus,
                attrBonus: attrHitBonus,
                profBonus: profBonus,
                startingResource: currResource,
                startingDurability: durability,
                damageDice: damageDice,
                resourceCost: resourceCost,
                weaponBroken: false,
                exhausted: false,
                attacks: []
            };

        // Required fields for calculating an attack. Other ones have a default value. 
        if ( isNaN(currResource) || isNaN(attrHitBonus) || damageDice === null) {
            log(`One of the required fields for an attack was invalid.`);
            log(`Current Resource: ${currResource}`);
            log(`Attr Hit Bonus: ${attrHitBonus}`);
            log(`Damage Dice: ${damageDice}`);
            return null;
        } 
        
        //Per Attack
        for (let atk = 0; atk < numAttacks; atk++){
            
            /*** Check and calculate Resources *******/
            if (currResource < resourceCost){
                attackResult.exhausted = true;     
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
                if(type === "melee") {
                    durabilityLost++;
                    if (durabilityLost >= durability){
                        attackResult.weaponBroken = true;
                        break;
                    }
                }
            }else {//hit
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
                    log(`Error getting dmgRoll! Expected an int and received ${dmgRoll}`);
                    return null;
                }

                if (attack.atkcrit){
                    let addedCritRolls = ( (type === "melee") ? parseInt(getAttrByName(id, fields.meleecrit), 10) : parseInt(getAttrByName(id, fields.rangedcrit), 10) ) || 1
                    numRolls = numRolls + (addedCritRolls * numRolls);
                }

                while (atkDmg == 0 || atkDmg < dmgMin) {
                    atkDmg = 0;
                    atkRolls = [];

                    for(let i = 0; i < numRolls; i++){
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
                attack.damage = 0;
            }
            /*** Finalize this Attack and add to result. Go to next loop iteration. */
            attackResult.attacks.push(attack);
        }

        //Summary numbers
        attackResult.finalDamage = finalDamage;
        attackResult.resourceUsed = resourceUsed;
        attackResult.durabilityLost = durabilityLost;
        return attackResult;
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
        
        if (match[2] == null){
            log("Invalid Dice Regex! Got:");
            log(match);
            return null;
        }

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