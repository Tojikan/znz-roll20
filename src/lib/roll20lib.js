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

    sendChat(sender, output);
}



export function setupScriptVars(msg){
    let sender = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
    let args = tokenizeArgs(msg.content)
    let character = getCharacter(msg, args);

    if (!character){
        throw('No Character was selected or specified!');
    }

    return {
        args: args,
        sender: sender,
        character: character,
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



/**
 * Extract array of repeater IDs from character attributes
 * @param {*} repeaterId 
 * @returns 
 */
 export const getRepeaterIds = function(repeaterId, characterId){
    let result = [];

    let attributes = findObjs({type:'attribute', characterid:characterId});

    const regexGetRowId = function(str){
        return str.match(/(?<=_)-(.*?)(?=_)/);
    }

    attributes.map((attr)=>{
        if (attr.get('name').startsWith(`repeating_${repeaterId}_`)){
            let row = regexGetRowId(attr.get('name'));

            if (row){
                if (!result.includes(row[0])){
                    result.push(row[0]);
                }
            }
        }
    });

    return result;
}


/**
 * API Script version for this since this is a sheetworker only function on R20.
 * @returns a new row ID for a repeater row.
 */
export const generateRowID = function () {
    "use strict";

    /**
     * Generates a UUID for a repeater section, just how Roll20 does it in the character sheet.
     * https://app.roll20.net/forum/post/3025111/api-and-repeating-sections-on-character-sheets/?pageforid=3037403#post-3037403
    */
    const generateUUID = function() { 
        "use strict";

        var a = 0, b = [];
        return (function() {
            var c = (new Date()).getTime() + 0, d = c === a;
            a = c;
            for (var e = new Array(8), f = 7; 0 <= f; f--) {
                e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
                c = Math.floor(c / 64);
            }
            c = e.join("");
            if (d) {
                for (f = 11; 0 <= f && 63 === b[f]; f--) {
                    b[f] = 0;
                }
                b[f]++;
            } else {
                for (f = 0; 12 > f; f++) {
                    b[f] = Math.floor(64 * Math.random());
                }
            }
            for (f = 0; 12 > f; f++){
                c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
            }
            return c;
        })();
    }

    return generateUUID().replace(/_/g, "Z");
};