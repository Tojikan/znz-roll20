var Attack = Attack || (function() {
    'use strict';
    const  fields = [[{dataquery:'attackFields'}]],
        strengthAttr = "[[{attrlookup:'strength'}]]",
        dextAttr = "[[{attrlookup:'dexterity'}]]",
        energyStat = "[[{attrlookup:'energy'}]]",
        meleeHitRoll = "[[{attrlookup:'meleehitroll'}]]",
        rangedHitRoll = "[[{attrlookup:'rangedhitroll'}]]",
        unarmedProf = "[[{attrlookup:'unarmedprof'}]]",
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

        const params = validateParams(args); //returns string on error or object of validated api command inputs

        if (typeof params == "string" ){
            sendMessage("Error! " + params , sender, true, "danger");
            return; 
        }


        const attackArgs = getAttackArgs(params);
        
        HandleAttack(sender,character,args);
    },
    /**
     * Validates params are properly input in the correct format. Assigns default values where possible.
     * Ensures that only proper params will be passed forward.
     * 
     * @param args A tokenized API Chat command from the splitArgs() function.
     * @returns an object containing validated parameters and values or a string if a fatal invalidation occurred.
     */
    validateParams = function(args) {

        var retObj = {};
        const integerParams = ["attacks", "hitbonus", "critbonus", "damagebonus"],
            flagParams = ['unarmed', 'alt'];


        // Handle Type
        if (args[0].indexOf('melee') > 0){ //allow use of !!attackmelee shorthand
            retObj.type = 'melee';
        } else if (args[0].indexOf('ranged') > 0) { //!!attackranged shorthand
            retObj.type = 'ranged';
        } else if ("type" in args) {
            retObj.type = args.type;
        } else {
            return "No attack type was specified! You must specify if this is a melee or ranged attack! Add 'type=melee' or 'type=ranged'.";
        }

        // Verify correct type
        if (retObj.type !== 'melee' || retObj.type !== 'ranged') {
            return "Invalid attack type. Type must be melee or ranged. Add 'type=melee' or 'type=ranged'.";
        }

        // Handle Difficulty
        if ("difficulty" in args) {
            if ( [0,1,2,3,4].indexOf(args.difficulty) == -1 ) {
                return "Invalid Difficulty. Base Difficulty must be 0, 1, 2, 3, or 4"
            } else {
                retObj.difficulty = args.difficulty;
            }
        } else {
            retObj.difficulty = 1; //Set Default
        }

        //Handle Integer Params
        for (const param in integerParams) {
            if (param in args) {
                let paramInt = parseInt(args[param], 10);
                if (isNaN(paramInt)){ return `Invalid value supplied for parameter '${param}'. '${param}' must be an integer.`};
                
                if (paramInt < 0){
                    paramInt = 0;
                }

                retObj[param] = paramInt;
                continue;
            } else {
                retObj[param] = 0;
            }
        }

        //Handle Flags
        for (const param in flagParams) {
            if (param in args) {
                if (typeof args[param] !== "boolean") { return `Invalid value supplied for parameter '${param}'. '${param}' must be true or false`}
                retObj[prop] = args[prop]
            } else {
                retObj[prop] = false;
            }
        }

        // Verify Attacks. This may have been handled already in integer Params
        if (!("attacks" in retObj) || !Number.isInteger(retObj.attacks) || retObj.attacks < 0  ) {
            retObj.attacks = 1 //Default value
        }

        // Don't allow an alt unarmed attack
        if (retObj.alt && retObj.unarmed) {
            return "You cannot make an alternative attack if you are making an unarmed attack!";
        }

        return retObj;

    },
    /**
     * Gathers all information around an attack from params, pulls any information from the character sheet and generates an
     * object to be ready for calculating an attack result.
     * @param params - params object created from validateParams
     * @param id - Character Id
     * @returns an Attack object containing all values necessary to calculate an attack. 
     */
    generateAttackObject = function(params, id) {
        var isMelee = (params.type === 'melee'),
            prefix = isMelee ? meleePrefix : rangedPrefix,
            type = params.type;

        //Flip fields for alt attacks - melee with ranged weapon or throw melee weapon
        if (params.alt) { 
            type = isMelee ? 'ranged' : 'melee';
            prefix = isMelee ? rangedPrefix : meleePrefix; //flip prefixes
            isMelee = !isMelee;
        }
 
        const fields = makePrefixedObject(prefix, fields.weaponFields), //retrieve melee slot weapon or ranged slot weapon
            resourceType = isMelee ? energyStat : fields.ammo,
            hitAttr = isMelee ? strengthAttr : dextAttr,
            hitRollType = isMelee ? meleeHitRoll : rangedHitRoll;


        var attackProf, damageDice, critMultiplier, resourceCost;

            
        // special values for unarmed - a 1d1 melee attack.
        if (params.unarmed && isMelee) {
            attackProf = parseInt(getAttrByName(id, unarmedProf), 10);
            damageDice = '1d1';
            critMultiplier = 2;
            resourceCost = 1;
            startDurability = 999999 //some sufficiently high number
        } else {
            damageDice = getAttrByName(id, ( isMelee ? fields.meleedamage : fields.rangeddamage )) || '' ;
            attackProf = parseInt(getAttrByName(id, ( isMelee ? fields.meleetype : fields.rangedtype )), 10);
            critMultiplier = parseInt(getAttrByName(id, ( isMelee ? fields.meleecrit : fields.rangedcrit )), 10);
            resourceCost = isMelee ? ( parseInt(getAttrByName(id, fields.meleecost), 10) || 1 ) : 1;
            startDurability = parseInt(getAttrByName(id, fields.durability), 10) || 0;
        }

        return {
            type: type,
            // passed from param
            numAttacks: params.attacks,  // number of attack rolls to make
            difficulty: params.difficulty,  // base difficulty level, 0-4
            unarmed: ( params.unarmed && isMelee ), // unarmed strike
            alternative: params.alt, // flipped weapon fields
            hitbonus: params.hitbonus, // additional flat bonus on top of hit dice results, added via params
            critbonus: params.critbonus, // additional bonus directly to hit dice for higher hit/crit chance, added via params  
            damagebonus: params.damagebonus, // additional bonus to each damage, added via params
            // Affected by unarmed
            attackProf: attackProf, // weapon proficiency mod
            damageDice: damageDice, // weapon damage dice
            critMultiplier: critMultiplier, // weapon crit multiplier
            resourceCost: resourceCost, // energy cost for melee weapon, otherwise 1
            startDurability: startDurability, // starting weapon durability
            // Char sheet fields
            weaponName: getAttrByName(id, prefix + "_" + weaponNameField) || '',
            hitRoll: parseInt(getAttrByName(id, hitRollType)) || 10, // character's hit roll
            attrHitMod: parseInt(getAttrModAndBonus(hitAttr, id, true), 10) || 0, // str/dext modifier added to attack
            startResource: parseInt(getAttrByName(id, resourceType), 10), // starting resource
            // To be populated by calculateAttackResults().
            rolls: [],
            weaponBroken: false,
            exhausted: false
        };
    },
    calculateAttackResults = function(attack){
        var attackResult = attack;

        const dmgDice = parseDamageDice(damageDice),
            isMelee = (type === 'melee');

        // Required fields for calculating an attack.
        if ( isNaN(startResource)){
            log(`Attack Script Error! Starting Resource ${isMelee ? 'Energy' : 'Ammo'} is not a number!`);
            throw `The field for the ${isMelee ? 'Energy' : 'Ammo'} resource is not a valid value!`;
        } 
        if ( dmgDice == null){
            log(`Attack Script Error! Could not parse damage dice!`);
            throw `Weapon damage field for ${weaponName} is an invalid value!`;
        } 


        for (let i = 0; i < attack.numAttacks; i++){
            /*** Check and calculate Resources *******/
            if (currResource < resourceCost ){
                attackResult.exhausted = true;     
                break;
            }

            if (isMelee && !unarmed && (durability <= 0 || attackResult.weaponBroken)){
                attackResult.weaponBroken = true;
                break;
            }

            resourceUsed += resourceCost;
            currResource -= resourceCost;

        }
    },



    HandleAttack = function(sender, character, args) {


        //Determine and Inputs
        var prefix = args.type == "melee" ? meleePrefix : rangedPrefix,
            numAttacks = parseInt(args.attacks,10) || 1,
            baseDifficulty = (args.difficulty == "0") ? 0 : ((parseInt(args.difficulty,10) * 3) || 3),
            weaponName = getAttrByName(character.id, prefix + "_" + weaponNameField) || '', //set this here out of laziness, this gets used in outputAttack
            inputFields = makePrefixedObject(prefix, fields.weaponFields),
            hitBonus = parseInt(args.bonus,10) || 0,
            unarmed = false,
            reversed = false,
            attackResult = null;

        //If alternate, we melee with our ranged weapon and throw our melee weapon.
        if (("reversed") in args && args.reversed == true){
            args.type = (args.type == "melee") ? "ranged" : "melee";
            reversed = true;
        }

        //If alternate, we melee with our ranged weapon and throw our melee weapon.
        if (("unarmed") in args && args.unarmed == true){
            if (args.type === "melee"){
                unarmed = true;
            }
        }

        //Calculate an Attack
        try{
            attackResult = calculateAttack(inputFields, character.id, args.type, numAttacks, baseDifficulty, hitBonus, reversed, unarmed)

        } catch(e){
            sendMessage(`The following error occurred while calculating your ${args.type} attack. Please make sure all the sheet fields are entered properly with the correct format and try again. <br/><br/>'${e}'`, sender, true, "danger");
            log(`Error when making a ${args.type} attack by ${sender}`);
        }
        
        //With the results from a calculated attack
        if (attackResult) {
            //Set Attrs
            try {
                attrLookup(character, attackResult.resourceType).setWithWorker({current: (attackResult.startingResource - attackResult.resourceUsed)});
    
                if (args.type == "melee"){
                    attrLookup(character, `${meleePrefix}_${fields.weaponFields.durability}`).setWithWorker({current: (attackResult.startingDurability - attackResult.durabilityLost)});
                }
            } catch(e){
                sendMessage(`The following error occurred while subtracting resources for your ${args.type} attack. The resource was ${attackResult.resourcetype}, the starting amount was ${attackResult.startingResource} and the spent amount was ${attackResult.resourceUsed}. <br/><br/>'${e}'`, sender, true, "danger");
                log(`Error when subtracting a ${args.type} attack by ${sender}`);
            }

            //Output into the chat. 
            outputAttack(attackResult, character.get('name'), args.type, weaponName);
        }
    },
    /**
     * TODO - rework this
     * 
     * This method calculates an attack based on inputs and returns a JSON object representing the results of an attack.
     * There are some global properties which describe the circumstances of the attack and an Attacks array which stores the result of each attack and their rolls.
     */
    calculateAttack = function(fields, id, type, numAttacks, baseDifficulty, hitBonus, reversed, unarmed) {

        //Select fields based off if melee or not.
        const isMelee = (type === "melee"),
                resourceType = isMelee ? energyStat : fields.ammo,
                hitAttr = isMelee ? strengthAttr : dextAttr,
        attackProf = unarmed ? unarmedProf : (isMelee ? fields.meleetype : fields.rangedtype),
        damageType = isMelee ? fields.meleedamage : fields.rangeddamage,
        critType = isMelee ? fields.meleecrit : fields.rangedcrit,
        resourceCost = isMelee ? (parseInt(getAttrByName(id, fields.meleecost), 10) || 1 ): 1,
            hitRollType = isMelee ? meleeHitRoll : rangedHitRoll;

        var currResource =  parseInt(getAttrByName(id, resourceType), 10),
            damageDice = unarmed ? parseDamageDice('1d1') : parseDamageDice(getAttrByName(id, damageType)),
            hitRoll = parseInt(getAttrByName(id, hitRollType)) || 10,
            profBonus =  parseInt(getAttrModAndBonus(attackProf, id, false), 10) || 0, //The weapon type value equals a proficiency attr, so we can directly retrieve a weapon proficiency using weapon type field
            durability = parseInt(getAttrByName(id, fields.durability), 10) || 0,
            attrHitBonus =  parseInt(getAttrModAndBonus(hitAttr, id, true), 10) || 0, //add str/dext to attack
            critBonus =  parseInt(getAttrByName(id, critType), 10) || 1,
            durability = parseInt(getAttrByName(id, fields.durability), 10) || 0,
            resourceUsed = 0,
            finalDamage = 0,
            durabilityLost = 0,
            attackResult = {
                type: type,
                numAttacks: numAttacks,
                baseDifficulty: baseDifficulty,
                unarmed: unarmed,
                reversed: reversed,
                profBonus: profBonus,
                damageDice: damageDice,
                critBonus: critBonus,
                attrBonus: attrHitBonus,
                resourceCost: resourceCost,


                hitRoll: hitRoll,
                hitBonus: hitBonus,
                resourceType: resourceType,
                startingResource: currResource,
                startingDurability: durability,
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

            if (isMelee && !unarmed && (durability <= 0 || attackResult.weaponBroken)){
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
                if (isMelee && !unarmed) {
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
                    if (!unarmed){
                        numRolls = numRolls + (critBonus * numRolls);
                    } else {
                        numRolls++;
                    }   
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
            case 3:
                difficulty = "Medium";
                break;
            case 6:
                difficulty = "Hard";
                break;
            case 9:
                difficulty = "Insane";
                break;
            case 12:
                difficulty = "Impossible";
                break;
            default:
                difficulty = "Medium (Unk)"

        }
        
        var outputText = `\
        <h4>${typeText} Attack</h4>\
        <div>${attack.unarmed ? `${name} makes an unarmed attack! ` : `${name} tries to attack ${attack.numAttacks} time(s) with ${weaponName.length > 0 ? `their ${weaponName}` : 'their weapon'}`}</div><br/>\
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
        ${attack.weaponBroken && isMelee && !attack.unarmed ? `<div style="color:red"> The weapon was broken!</div>` : ''}\
        ${attack.exhausted ? `<div style="color:red"> ${name} is out of ${ isMelee ? 'energy' : 'ammo'}!</div>` : ''}\
        <div>Total Damage: <strong>${attack.finalDamage}</strong></div>\
        <div>${ isMelee ? 'Energy' : 'Ammo'} Spent: <strong>${attack.resourceUsed}</strong></div>\
        ${isMelee ? `<div>Durability Lost:  <strong>${attack.durabilityLost}</strong></div>` : ''}\
        <div>Attacks Made:  <strong>${attack.rolls.length}</strong></div>\
        </div>\ `;
        
        sendChat(
            `ZnZ - Attack Script`,
            `<div ${wrapperStyle}>${outputText}</div>`
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