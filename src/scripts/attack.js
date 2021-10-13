import { fields as charFields } from '../model/character';
import { getAttr, getAttrVal } from './_helpers';


export function handleAttack(character, args){

    if (!("rolls" in args)){
        return {msg: "You must specify the number of rolls!", type:"error"};
    }

    if (!("dice" in args)){
        return {msg: "You must specify the dice roll!", type:"error"};
    }


    let dice = args['dice'],
        rolls = args['rolls'],
        results = [], 
        weaponName = 'weapon',
        ap = getAttrVal(character, charFields.stats.ap.id),
        resourceText = 'Uses',
        bonus = 0,
        type = '',
        retVal = {};

    if (!Number.isInteger(rolls)){
        return {error: `You must specify an integer for rolls argument!`};
    }

    if ("weaponname" in args){
        weaponName = args['weaponname'];
    }

    if ("type" in args){

        if (args['type'] == 'melee'){
            resourceText =  'Durability';
            type = "Melee";
            bonus = getAttrVal(character, charFields.skills.options.melee.id);
        } else {
            resourceText = 'Ammo';
            type = "Ranged";
            bonus = getAttrVal(character, charFields.skills.options.ranged.id);
        }

    }
    
    results.push({msg:`${character.get('name')} attempts to attack ${rolls} times with their ${weaponName}!`, type:'Action'});
    results.push({msg:`${weaponName}`, type:'Weapon'});
    results.push({msg:`${ap}`, type:'Available AP'});

    if (rolls > ap){
        rolls = ap;
        results.push({msg: `<span style='color:red'> Did not have enough AP for ${args['rolls']} attacks! </span>`, type:`Problem`});
    }
    
    //calculate resource spending
    if ("resource" in args){
        let res = args["resource"];

        let resource = getAttr(character, res);

        if (!resource){
            results.push({msg:`Could not locate a value for '${res}'`, type:'Error'});
            rolls = 0;

        } else if (resource.get('current') == 0){
            results.push({msg: `<strong style='color:red'> ${character.get('name')}'s ${weaponName} has no ${resourceText} remaining!</strong>`, type:`Problem`});
            rolls = 0; //reset for defend
        } else {
            let spent = spendResource(rolls, res, character);

            if (spent){
                //if spent is less than rolls, that means we have no uses left. Subtract rolls.
                if (spent.spent < rolls){
                    rolls = spent.spent; 
                    results.push({msg: `<span style='color:red'> Did not have enough ${resourceText} for ${args['rolls']} attacks! </span>`, type:`Problem`});
                }

                results.push({msg: `${dice} ${(bonus > 0) ? `( + ${bonus} ${type} skill bonus}` : ''}`, type:`Attack Roll`});
                

                results.push({msg: rolls, type:`Attacks Made`});
                results.push({msg: spent.initial, type:`Initial ${resourceText}`});
                results.push({msg: spent.spent, type:`${resourceText} Spent`});
                results.push({msg: spent.remaining, type:`${resourceText} Remaining`});
            }

            let rollText = generateRollText(rolls, dice + " + " + bonus);
            retVal.roll = rollText;
        }
    }
    
    // Done with main attack roll
    retVal.results = results;
    
    
    // Now calculate defense.
    if ("defend" in args && args['defend'] != 0){
        let defend = args['defend'];
        
        if (Number.isInteger(defend) && defend > 0){

            let defenseResults = [],
                spentAp = rolls;

            
            defenseResults.push({msg:`${character.get('name')} attempts to defend ${defend} times!`, type:'Action'});

            if (spentAp + defend > ap){
                defenseResults.push({msg:`<span style='color:red'> Did not have enough AP to defend ${defend} times! </span>`, type:'Problem'});

                while (defend > 0 && spentAp + defend > ap){
                    defend--;
                }
            }

            if (defend > 0){
                let dodge = getAttrVal(character, charFields.defense.id),
                    armor = getAttrVal(character, charFields.defense.bonus.id),
                    defenseDice = `1d${dodge} + ${armor}`;

                defenseResults.push({msg:defenseDice, type:'Defense Roll'});
                defenseResults.push({msg:defend, type:'Defense Rolls made'});

                let defenseRoll = generateRollText(defend, defenseDice);

                retVal.defenseResults = defenseResults;
                retVal.defenseRoll = defenseRoll;
            }
        } else {
            log('Attack Script: Invalid defend value');
        }
    }
    
    
    
    
    return retVal;
}


function generateRollText(amount, dice){

    let rollText = '';

    //generate rolltext in the form of {{dice,dice,dice}}
    for (let i = 0; i < amount; i++){
        rollText += dice

        if (i < amount - 1){
            rollText += ','
        }
    }

    return `{{${rollText}}}`;
}


function spendResource(amount, resource, character){
    let attr = getAttr(character, resource);

    if (!attr){
        return null;
    }

    let current = attr.get('current'),
        newVal = Math.max( current - amount, 0); //floor it at 0

    log(newVal);

    
    attr.setWithWorker({current: newVal});

    return {
        spent: current - newVal,
        remaining: newVal,
        initial: current
    }
}