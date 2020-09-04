var Attack = Attack || (function() {
    'use strict';
    const  fields = {"weaponFields":{"meleetype":"melee_type","durability":"melee_durability","meleecost":"melee_energy_cost","meleedamage":"melee_damage","meleecrit":"melee_crit_bonus","reach":"weapon_reach","rangedtype":"ranged_type","ammo":"ranged_ammo","reloads":"ranged_reloads","rangeddamage":"ranged_damage","rangedcrit":"weapon_crit_bonus","range":"weapon_range"},"combatProfs":["prof_handguns","prof_shotguns","prof_rifles","prof_projectile","prof_throwing","prof_sharp_melee","prof_blunt_melee","prof_heavy_melee"]},
        strengthAttr = "strength",
        dextAttr = "dexterity",
        energyStat = "energy",
        meleeHitRoll = "melee_hit",
        rangedHitRoll = "ranged_hit",
        unarmedProf = "prof_unarmed",
        rangedPrefix ="equipped_ranged_weapon",
        meleePrefix = "equipped_melee_weapon",
        weaponNameField = "item_name",
        ATKSTATUS = {
            MISS: 'miss',
            FAIL: 'fail',
            HIT: 'hit',
            CRIT: 'crit',
        },

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

        // Calculate Attack
        var attackResult;
        try {
            const attackArgs = validateParams(args, character.id),
                attackObj = generateAttackObject(attackArgs, character.id);
                attackResult = calculateAttackResults(attackObj);
        } catch (e) {
            sendMessage('Error occurred while calculating an attack - ' + e, sender, true, "danger");
            sendMessage('Error occurred while calculating an attack - ' + e, 'gm', true, "danger");
            log('Error occurred while calculating an attack');
            log(e);
            return;
        }

        // Update values on character sheet
        try {
            if (attackResult){
                attrLookup(character, attackResult.resourceType).setWithWorker({current: (attackResult.startResource - attackResult.resourceUsed)});
                if (attackResult.type == "melee" && !attackResult.unarmed){
                    attrLookup(character, `${meleePrefix}_${fields.weaponFields.durability}`).setWithWorker({current: attackResult.newDurability });
                }
            }
        } catch (e) {
            sendMessage('Error occurred while writing attack results to character - ' + e, sender, true, "danger");
            sendMessage('Error occurred while writing attack results to character - ' + e, 'gm', true, "danger");
            log('Error occurred while writing attack results to character');
            log(e);
            return;
        }

        // Output attack results
        try {
            //Output into the chat. 
            outputAttack(attackResult, character.get('name'));
        } catch (e) {
            sendMessage('Error occurred while outputting attack results. Attack was successful. - ' + e, sender, true, "danger");
            sendMessage('Error occurred while outputting attack results. Attack was successful. - ' + e, 'gm', true, "danger");
            log('Error occurred while outputting attack results. Attack was successful.');
            log(e);
            return;
        }
    },
    /**
     * Validates params are properly input in the correct format. Assigns default values where possible.
     * Ensures that only proper params will be passed forward.
     * 
     * @param args A tokenized API Chat command from the splitArgs() function.
     * @returns an object containing validated parameters
     * @throws a message if invalid value was returned.
     */
    validateParams = function(args, id) {

        var retObj = {};
        const integerParams = ["attacks", "hitbonus", "critbonus", "damagebonus"],
            flagParams = ['unarmed', 'alt', 'snipe', 'kungfu'];


        // Handle Type
        if (args[0].indexOf('melee') > 0){ //allow use of !!attackmelee shorthand
            retObj.type = 'melee';
        } else if (args[0].indexOf('ranged') > 0) { //!!attackranged shorthand
            retObj.type = 'ranged';
        } else if(args[0].indexOf('unarmed') > 0){
            retObj.type = 'melee';
            retObj.unarmed = true;
        } else if ("type" in args) {
            retObj.type = args.type;
        } else {
            throw "No attack type was specified! You must specify if this is a melee or ranged attack! Add 'type=melee' or 'type=ranged'.";
        }

        // Verify correct type
        if (retObj.type !== 'melee' && retObj.type !== 'ranged') {
            throw "Invalid attack type. Type must be melee or ranged. Add 'type=melee' or 'type=ranged'.";
        }

        // Handle Difficulty
        if ("difficulty" in args) {
            if ( [0,1,2,3,4].indexOf(args.difficulty) == -1 ) {
                throw "Invalid Difficulty. Base Difficulty must be 0, 1, 2, 3, or 4"
            } else {
                retObj.difficulty = args.difficulty;
            }
        } else {
            retObj.difficulty = 1; //Set Default
        }

        //Handle Integer Params
        for (const param of integerParams) {
            if (param in args) {
                let paramInt = parseInt(args[param], 10);
                if (isNaN(paramInt)){ throw `Invalid value supplied for parameter '${param}'. '${param}' must be an integer.`};
                
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
        for (const param of flagParams) {
            if (param in args) {
                if (typeof args[param] !== "boolean") { throw `Invalid value supplied for parameter '${param}'. '${param}' must be true or false`}
                retObj[param] = args[param]
            } else if( param in retObj){
                //Do nothing if already added somehow
            } else {
                retObj[param] = false;
            }
        }

        // Verify Attacks. This may have been handled already in integer Params
        if (!("attacks" in retObj) || !Number.isInteger(retObj.attacks) || retObj.attacks <= 0  ) {
            retObj.attacks = 1 //Default value
        }

        // Don't allow an alt unarmed attack
        if (retObj.alt && retObj.unarmed) {
            throw "You cannot make an alternative attack if you are making an unarmed attack!";
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
            isMelee = !isMelee;
        }
 
        const weapon = makePrefixedObject(prefix, fields.weaponFields), //retrieve melee slot weapon or ranged slot weapon
            resourceType = isMelee ? energyStat : weapon.ammo,
            hitAttr = isMelee ? strengthAttr : dextAttr,
            hitRollType = isMelee ? meleeHitRoll : rangedHitRoll;


        var weaponProf, damageDice, critMultiplier, resourceCost;

            
        // special values for unarmed - a 1d1 melee attack.
        if (params.unarmed && isMelee) {
            weaponProf = unarmedProf;
            damageDice = '1d1';
            critMultiplier = 1;
            resourceCost = 1;
        } else {
            damageDice = getAttrByName(id, ( isMelee ? weapon.meleedamage : weapon.rangeddamage )) || '' ;
            weaponProf = getAttrByName(id, ( isMelee ? weapon.meleetype : weapon.rangedtype )) || '';
            critMultiplier = parseInt(getAttrByName(id, ( isMelee ? weapon.meleecrit : weapon.rangedcrit )), 10) || 1;
            resourceCost = isMelee ? ( parseInt(getAttrByName(id, weapon.meleecost), 10) || 1 ) : 1;
        }

        // Martial Artist flag
        if (params.kungfu && isMelee && params.unarmed) {
            let strMod = parseInt(getAttrModAndBonus(strengthAttr, id, true), 10) || 1;
            params.damagebonus +=  ( strMod > 0 ? strMod : 1);
        } 

        // Sniper
        if (params.snipe && !isMelee) {
            params.hitbonus += 2;
            params.critbonus += 2;
        }

        return {
            type: type,
            resourceType: resourceType,
            // passed from param
            numAttacks: params.attacks,  // number of attack rolls to make
            baseDifficulty: params.difficulty,  // base difficulty level, 0-4
            unarmed: ( params.unarmed && isMelee ), // unarmed strike
            alternative: params.alt, // flipped weapon fields
            snipe: (params.snipe && !isMelee),
            kungfu: (params.kungfu && isMelee && params.unarmed),
            hitbonus: params.hitbonus, // additional flat bonus on top of hit dice results, added via params
            critbonus: params.critbonus, // additional bonus directly to hit dice for higher hit/crit chance, added via params  
            damagebonus: params.damagebonus, // additional bonus to each damage, added via params
            // Affected by unarmed
            weaponProf: weaponProf,
            damageDice: damageDice, // weapon damage dice
            critMultiplier: critMultiplier, // weapon crit multiplier
            resourceCost: resourceCost, // energy cost for melee weapon, otherwise 1
            // Char sheet fields
            weaponProfMod: parseInt(getAttrByName(id, weaponProf), 10) || 0, // weapon proficiency mod
            weaponName: getAttrByName(id, prefix + "_" + weaponNameField) || '',
            startDurability: parseInt(getAttrByName(id, weapon.durability), 10) || 0, // starting weapon durability
            hitRoll: parseInt(getAttrByName(id, hitRollType)) || 10, // character's hit roll
            attrHitMod: parseInt(getAttrModAndBonus(hitAttr, id, true), 10) || 0, // str/dext modifier added to attack
            startResource: parseInt(getAttrByName(id, resourceType), 10), // starting resource
            
        };
    },
    /**
     * Main function to calculate results of an attack.
     */
    calculateAttackResults = function(attackObj){
        //Destructure from attackObject
        const { type, numAttacks, baseDifficulty, unarmed, hitbonus, critbonus, damagebonus, weaponProfMod, 
            damageDice, critMultiplier, startDurability, resourceCost, hitRoll, attrHitMod, startResource, 
            weaponName } = attackObj;

        // Set up Constants
        const dmgDice = parseDamageDice(damageDice),
            isMelee = (type === 'melee');
            
        // Check Required fields for calculating an attack.
        if ( isNaN(startResource)){
            log(`Attack Script Error! Starting Resource ${isMelee ? 'Energy' : 'Ammo'} is not a number!`);
            throw `The field for the ${isMelee ? 'Energy' : 'Ammo'} resource is not a valid value!`;
        } 
        if ( isMelee && !unarmed && isNaN(startDurability)){
            log(`Attack Script Error! Weapon Durability Field is empty`);
            throw `The field for the ${isMelee ? 'Energy' : 'Ammo'} resource is not a valid value!`;
        } 
        if ( dmgDice == null){
            log(`Attack Script Error! Could not parse damage dice!`);
            throw `Weapon damage field for ${weaponName} is an invalid value!`;
        }
         
        // Set up Vars for Tracking
        var attackResult = { ...attackObj},
            currResource = startResource,
            currDurability = startDurability,
            resourceUsed = 0,
            finalDamage = 0;

        attackResult.weaponBroken = false;
        attackResult.exhausted = false;
        attackResult.attacksMade = [];

        for (let i = 0; i < numAttacks; i++){

            /*** Check and calculate Resources *******/
            if (currResource < resourceCost ){
                attackResult.exhausted = true;     
                break;
            }

            if (isMelee && !unarmed && (currDurability <= 0 || attackResult.weaponBroken)){
                attackResult.weaponBroken = true;
                break;
            }
            resourceUsed += resourceCost;
            currResource -= resourceCost;
            
            
            /****** calculate hit roll and difficulty. ******/
            var attack = {},
                rawRoll = randomInteger(hitRoll + critbonus),
                difficulty = (baseDifficulty*3) + (randomInteger(3)),
                status = ATKSTATUS.MISS,
                totalRoll = rawRoll + hitbonus + attrHitMod + weaponProfMod;

            //Store rolled values
            attack.hitRollRaw = rawRoll;
            attack.totalRoll = totalRoll;
            attack.difficulty = difficulty;

            //Determine results
            if ( rawRoll >= 10){
                status = ATKSTATUS.CRIT;
            } else if ( rawRoll == 1) {
                status = ATKSTATUS.FAIL;
                
                //Melee durability
                if (isMelee && !unarmed) {
                    currDurability--;
                    if (currDurability <= 0) {
                        attackResult.weaponBroken = true;
                    }
                }
            } else if ( totalRoll >= difficulty ) {
                status = ATKSTATUS.HIT;
            } else {
                status = ATKSTATUS.MISS;
            }
            attack.status = status;
            
            //Damage Calculations
            attack.totalDamage = 0;
            attack.rawDamage = 0;
            attack.bonusDamage = 0;
            attack.damageRolls = [];
            
            if (status === ATKSTATUS.HIT || status === ATKSTATUS.CRIT) {
                attack.damageRolls = rollTheDamage(dmgDice, (status === ATKSTATUS.CRIT), critMultiplier);
                attack.rawDamage = attack.damageRolls.reduce((a,b) => a + b,0);
                attack.bonusDamage = (parseInt(dmgDice[3],10) || 0) + damagebonus;
                attack.totalDamage = attack.rawDamage + attack.bonusDamage;

                finalDamage += attack.totalDamage;
            }

            attackResult.attacksMade.push(attack);
        }

        //Summary numbers
        attackResult.finalDamage = finalDamage;
        attackResult.resourceUsed = resourceUsed;
        attackResult.newDurability = currDurability;
        attackResult.durabilityLost = startDurability - currDurability;
        return attackResult;
    },
    /**
     * Rolls the damage rolls for successful attacks.
     */
    rollTheDamage = function(dmgDice, didCrit, critBonus) {
        /** Note on parsed dice
         * [0] - full match [1d6+3>2]
         * [1] - amount of dice (1) (optional, defaults to 1)
         * [2] - the dice [d6] (required)
         * [3] - dice bonus [+3] (optional) (this is a string)
         * [4] - dice mins, if present [>2] (optional)
         */
        var numRolls = parseInt(dmgDice[1], 10) || 1,                                   
            dmgRoll = parseInt(dmgDice[2], 10) || null,
            dmgMin = parseInt(dmgDice[4], 10) || 0,
            atkDmg = 0,
            dmgRollResult = [];

        // Add Crit Roll
        if (didCrit) {
            numRolls = numRolls + (critBonus * numRolls);
        }

        // Do the damage roll
        while (atkDmg == 0 || (dmgMin > 0 && atkDmg < dmgMin)) {  // while loop handles minimimum damage.
            atkDmg = 0; 
            dmgRollResult = [];

            for (let j = 0; j < numRolls; j++){
                let damage = randomInteger(dmgRoll);
                atkDmg += damage;
                dmgRollResult.push(damage);
            }
        }

        return dmgRollResult;
    },
    /**
     * Output the results of the attack into chat.
     */
    outputAttack = function(attack, name){
        
        const tableStyle = 'style="width:100%; text-align:center; margin-bottom: 10px;"',
            thStyle = 'style="text-align:center"',
            trStyle = 'style="margin-top: 10px; border-top: solid 1px #d3d3d3; border-bottom: solid 1px #d3d3d3"',
            tdStyle = 'vertical-align: top; padding: 10px;', //no style declaration
            divStyle = 'style="font-size: 21px; font-weight: 700; margin-bottom: 7px;"',
            rollStyle = 'style="border: solid 1px #d3d3d3; padding: 2px; background: white;"',
            msgStyle = 'style="border: solid 1px lightgray; padding: 1px 3px; background: white;"',
            wrapperStyle = 'style="border: solid 1px lightgray; padding: 3px;"',
            atkStyles = {
                crit: 'color:#135314; background:#baedc3',
                fail: 'color:#791006; background:#FFCCCB',
                hit: 'background:#FFFFBF',
            },
            isMelee = (attack.type == "melee"),
            typeText = isMelee ? 'Melee' : 'Ranged',
            attrType = isMelee ? 'Strength' : 'Dexterity';

        var allHitMods = [attack.attrHitMod, attack.weaponProfMod, attack.hitbonus ].filter( val => val > 0),
            difficultyText = "";

        switch(attack.baseDifficulty) {
            case 0:
                difficultyText = "Easy";
                break;
            case 1:
                difficultyText = "Medium";
                break;
            case 2:
                difficultyText = "Hard";
                break;
            case 3:
                difficultyText = "Insane";
                break;
            case 4:
                difficultyText = "Impossible";
                break;
            default:
                difficultyText = "Medium (Unk)";
        }
        
        var outputText = `\
        <h4>${typeText} Attack</h4>\
        <div>${attack.unarmed ? `${name} attacks with their bare fists! ` : `${name} tries to attack ${attack.numAttacks} time(s) with ${attack.weaponName.length > 0 ? `their ${attack.weaponName}` : 'their weapon'}`}</div><br/>\
        ${attack.alternative ? (isMelee ? `<div>${name} melees with their ranged weapon!</div><br/>`: `<div>${name} throws their melee weapon!</div><br/>`) : '' }\
        ${attack.snipe ? `<div>${name} uses their mad Sniper skills!` : '' }\
        ${attack.kungfu ? `<div>${name} unleashes their Kung-Fury!` : '' }<br/>\
        <div><strong>Weapon Damage</strong>: ${attack.damageDice}</div>\
        <div><strong>Hit Roll</strong>: D${attack.hitRoll}${attack.critbonus > 0 ? ` + ${attack.critbonus}` : ''}</div>\
        <div><strong>Difficulty</strong>: ${difficultyText}</div>\
        <div><strong>Crit Multiplier</strong>: <strong>${attack.critMultiplier}x</div>\
        <div><strong>${attrType} Modifier: </strong>${attack.attrHitMod}</div>\
        <div><strong>Weapon Proficiency: </strong>${outputProficiency(attack.weaponProf)} +${attack.weaponProfMod}</div>\
        ${ attack.hitbonus > 0 ? `<div><strong>Hit Bonus:</strong> ${attack.hitbonus} </div>` : ''}\
        ${ attack.critbonus > 0 ? `<div><strong>Crit Chance Bonus :</strong> ${attack.critbonus} </div>` : ''}\
        ${ attack.damagebonus > 0 ? `<div><strong>Damage Bonus:</strong> ${attack.damagebonus} </div>` : ''}<br/>`;
        log(attack);

        outputText += `<table ${tableStyle}><tr><th ${thStyle}>Roll</th><th ${thStyle}>Challenge</th><th ${thStyle}>Damage</th></tr> `;
        for (let i = 0; i < attack.attacksMade.length; i++){

            let atk = attack.attacksMade[i],
            dmgDescript = atk.damageRolls.map((x)=>{return `<span ${rollStyle}>${x}</span>`}).join('+') + (atk.bonusDamage > 0 ? '+' + atk.bonusDamage : ''),
            difficultyDescript = `CR:<span ${rollStyle}>${atk.difficulty}</span> ${ allHitMods.length > 0 ? '-(' + allHitMods.join('+') + ')' : ''}`;


            
            outputText += `<tr ${trStyle}>\
            <td style="${tdStyle} ${ atkStyles[atk.status] }"><div ${divStyle}>${atk.hitRollRaw}</div> <div>${capitalizeWord(atk.status)}</div></td>\
            <td style="${tdStyle}"><div ${divStyle}>${atk.difficulty - (attack.weaponProfMod + attack.attrHitMod + attack.hitbonus)}</div> <div style="font-size:11px;">${difficultyDescript}</div></td>\
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
        <div>Attacks Made:  <strong>${attack.attacksMade.length}</strong></div>\
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

        //test if simple int
        if (/^\d+$/.test(expr)){
            let parsed = parseInt(expr, 10);
            return [parsed, 1, parsed, 0, 0]; //if someone just enters a single number
        }

        if (expr === null || expr === ''){
            return null;
        }

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
    capitalizeWord = function(word){
        if (typeof word !== 'string'){
            return ''
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    },
    outputProficiency = function(prof){
        if (typeof prof !== 'string'){
            return ''
        }
        return prof.replace("prof_", '').replace('_',' ').replace(/\b\w/g, l => l.toUpperCase());
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