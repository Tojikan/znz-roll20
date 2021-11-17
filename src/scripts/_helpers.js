/**
 *  Library of usefull Roll20 API Functions
 */


/**
 * Spends X amount of attribute for a player. The attribute will be floored to 09
 * 
 * @param {integer} amount - Amount to reduce by
 * @param {string} resource - Attribute
 * @param {string} character - char ID
 * @returns object showing results of the spend.
 */
export function spendResource(amount, resource, character){
    let attr = getAttr(character, resource);

    if (!attr){
        return null;
    }

    let current = attr.get('current'),
        newVal = Math.max( current - amount, 0); //floor it at 0

    
    attr.setWithWorker({current: newVal});

    return {
        spent: current - newVal,
        remaining: newVal,
        initial: current
    }
}



/**
 * Tokenizes chat inputs for API commands
 * 
 * Step 1 - Splits chat by space unless the space is within single or double quotes.                                    Example: !example with 'text line' "hello world" gets split to ["!example", "with", "text line" "hello world"]
 * Step 2 - Tokenize everything into a Struct using a '=' to denote an argument in the form of [arg]=[value].           Example: !example test="hello world" is {0:"!example" test: "hello world"}
 * Step 2a - Everything to left of '=' becomes the key and everything to the right becomes the value
 * Step 2b - If no '=', the value will be the array position
 * Step 3 - If no regex match for =, check for any flags in the form of --flag. Set this to true.                                          Example: --unarmed    
 * Return the struct
 * 
 * There should not be spaces between '=' and the arg/value
 * @param {string} input - text input
 * @returns an object where each key is the param name and the value is its tokenized param value.
 */
 export function splitArgs (input) {
    var result = {},
        argsRegex = /(.*)=(.*)/, //can't be global but shouldn't need it as we are splitting args. 
        quoteRegex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g; //Split on spaces unless space is within single or double quotes - https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli
        
    
        var quoteSplit = input.match(quoteRegex).map(e => {
            //https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
            let quote = /(["'])(?:(?=(\\?))\2.)*?\1/g.exec(e); //get either ' or ", whatever is first

            //if no quotes, will be null
            if (quote){
                let re = new RegExp(quote[1], "g");
                return e.replace(re, ''); //remove outer quotes
            } else {
                return e;
            }
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
            result[quoteSplit[i]] = i;
        }
    }
    return result;
}


/**
 * Gets a player's selected character. Only returns the character if the player controls the Character or is a GM
 * 
 * @param {*} sender 
 * @param {*} msg 
 * @param {*} args 
 * @returns 
 */
export function getCharacter(sender, msg, args = {}){
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
 * Retrieve an attribute for a given character
 * @param {*} character 
 * @param {*} attribute 
 * @returns The Attribute value
 */
export const getAttr = function(character, attr){
    return findObjs({type: 'attribute', characterid: character.id, name: attr})[0];
}

/**
 * Get Attribute Value, and use default value if not present.
 * @param {*} character 
 * @param {*} attr 
 * @returns 
 */
export const getAttrVal = function(character, attr){
    return getAttrByName(character.id, attr);
}


/**
 * Extract Row ID from attribute Name
 * @param {*} str 
 */
export const regexGetRowId = function(str){
    return str.match(/(?<=_)-(.*?)(?=_)/);
}


/**
 * Extract array of repeater IDs from character attributes
 * @param {*} repeaterId 
 * @returns 
 */
export const getRepeaterIds = function(repeaterId, characterId){
    let result = [];

    let attributes = findObjs({type:'attribute', characterid:characterId});

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
 * 
 * @returns a new row ID for a repeater row.
 */
export const generateRowID = function () {
    "use strict";
    return generateUUID().replace(/_/g, "Z");
};


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