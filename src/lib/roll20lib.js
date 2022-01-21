import { tokenizeArgs } from "./znzlib";

/**
 * Use this in conjuction with outputDefaultTemplate or a string for a default template
 * @param {string} rollCommand 
 * @param {number} multiply Number to multiply by. Leave null to not add any
 * @param {string} multiplyLabel Label if you multiply. Defaults to Raw Damage.
 * @returns string
 */
export function generateRollResultText(rollCommand, multiply=null, multiplyLabel='Raw Damage'){
    let output = ' [[';

    output += `[[${rollCommand}]]`;

    if (multiply){
        output += `*[[${multiply}]]`
    }

    output += ']] ';

    output += ' {{Roll=$[[0]] Successes!}} ';

    if (multiply){
        output += ` {{${multiplyLabel}=$[[0]] * $[[1]]==$[[2]] }} `;
    }

    return output;
}

/**
 * 
 * @param {*} amount - number of dice
 * @param {*} target - target to roll against
 * @param {*} amountmod - add dice to amount
 * @param {*} dice - diceface
 * @returns 
 */
export function generatePoolRollText(amount, target, dice=10){
    //assume any conversions on negative rolls get handled prior to this method
    return `{${amount}d${dice}}<${target}`
}


/**
 * 
 * @param {*} arr  {label, value} or string. strings appended directly.
 * @param {*} name 
 * @param {*} sender 
 */
export function outputDefaultTemplate(arr, name, sender){
    let output = `&{template:default} {{name=${name}}} `;

    for (let msg of arr){
        if (typeof msg === 'string'){
            output += ' ' + msg + ' ';
        } else {
            output += ` {{${msg.label}=${msg.value}}}`;
        }
    }

    log(output);
    sendChat(sender, output);
}



export function setupScriptVars(msg){
    let sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
    let args = tokenizeArgs(msg.content)
    return {
        args: args,
        sender: sender,
        character: getCharacter(msg, args)
    };
}



/**
 * Gets a rowID from a button click on a sheet worker.
 * @param {*} eventInfo 
 * @returns 
 */
export function getButtonRowId(eventInfo){
    var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_");
    return eventInfo.sourceAttribute.substr(0, underscoreIndex);
};


/**
 * Gets a player's selected character from a msg or from passed in args. Only returns the character if the player controls the Character or is a GM
 * 
 * @param {*} msg 
 * @param {*} args 
 * @returns 
 */
 export function getCharacter(msg, args = {}){
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
        !_.contains(character.get('controlledby').split(','),'all') && 
        msg.playerid !== 'API'){
            return null;
        }

    } else{
        return null;
    }

    return character;
}

/**
 * Gets a full attribute object
 * @param {*} attrKey 
 * @returns attribute object
 */
export function getAttr(attrKey, characterId){
    return findObjs({type: 'attribute', characterid: characterId, name: attrKey})[0];
}
