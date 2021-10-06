/**
 *  Library of usefull Roll20 API Functions
 */



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
 * @param {string} input - text input
 * @returns an object where each key is the param name and the value is its tokenized param value.
 */
 export function splitArgs (input) {
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
}


/**
 * Gets a player's selected character. Only returns the character if the player controls the Character or is a GM
 * 
 * @param {*} sender 
 * @param {*} msg 
 * @param {*} args 
 * @returns 
 */
export function getCharacter(sender, msg, args){
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
        !_.contains(character.get('controlledby').split(','),'all')){
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
export var getAttrVal = function(character, attr){
    return findObjs({type: 'attribute', characterid: character.id, name: attr})[0];
}



