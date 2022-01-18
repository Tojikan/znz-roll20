/////// Library of Functions for Generic Use

/**
 * @deprecated use affixKey
 */
export function suffixKey(field, suffix){
    let fld = {...field};
    fld.key = fld.key + '_' + suffix;
    return fld;
}


export function affixKey(prefix, field, suffix){
    let fld = {...field};

    fld.key = (prefix ? prefix + '_' : '') + fld.key + (suffix ? '_' + suffix : '');

    return fld;
}

export function objToArray(obj) {
    return Object.keys(obj).map((x)=> obj[x]);
}


export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export function getLabel(field){
    return ( field.label ? field.label : capitalize(field.key) ) ?? 'NoLabel';
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
 * Sum up an array of strings
 * 
 * @param {array} values values to sum
 * @returns the sum of all values
 */
export function sumValues (values){
    return values.reduce((prev, curr) =>{
        return prev + (Number.parseInt(curr, 10) || 0);
    }, 0)
}

/**
 * Splits a string by | symbol, returning an an array of the split
 * @param {string} str passed in string
 * @returns array
 */
export function splitByPipe(str){
    return str.toString()
        .split('|')
        .filter(x => x); //make sure its valid
}