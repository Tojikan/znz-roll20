/////// Library of Functions for Generic Use

/**
 * Reduces object to a string.
 * @param {*} params Object
 * @returns string
 */
export function generateParamString(params){

    return Object.keys(params).reduce((prev, curr) =>{
        return prev += `${curr}="${params[curr]}" `;
    }, '')
}




/**
 * Affix prefix/suffix to a stirng.
 * @param {*} prefix 
 * @param {*} str 
 * @param {*} suffix 
 * @returns 
 */
export function affixStr(prefix, str, suffix){
    return (prefix ? prefix + '_' : '') + str + (suffix ? '_' + suffix : '');
}


/**
 * Prepends/Appends a prefix/suffix to a field key.
 * @param {*} prefix 
 * @param {*} field 
 * @param {*} suffix 
 * @returns 
 */
export function affixKey(prefix, field, suffix){
    let fld = {...field};

    const isSet = (x) => x == null || x == undefined;

    fld.key = (!isSet(prefix) ? prefix + '_' : '') + fld.key + (!isSet(suffix) ? '_' + suffix : '');

    return fld;
}

/**
 * Converts an object to array based on its keys.
 * @param {*} obj 
 * @returns 
 */
export function objToArray(obj) {
    return Object.keys(obj).map((x)=> obj[x]);
}

/**
 * Calls a function on each key-value of an object
 * @param {*} obj 
 * @param {*} callback 
 * @returns 
 */
export function objMap(obj, callback){
    let o = {...obj};
    
    for (let key of Object.keys(obj)){
        o[key] = callback(obj[key]);
    }
    return o;
}

/**
 * Capitalize first char of string.
 * @param {*} str 
 * @returns 
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Retrives a label for a field, or capitalizes its key if it has none.
 * @param {*} field 
 * @returns 
 */
export function getLabel(field){
    return ( field.label ? field.label : capitalize(field.key) ) ?? 'NoLabel';
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
 export function tokenizeArgs(input) {
    const result = {};
    
    //First bit of regex: splits among spaces, unless a space is wrapped in `'" 
    const quoteRegex = /(?:[^\s"'`]+|"[^"]*"|'[^']*'|`[^`]*`)+/g; //adapted from https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli
    var quoteSplit = input.match(quoteRegex).map(e => {
        //https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
        let quote = /([`"'])(?:(?=(\\?))\2.)*?\1/g.exec(e); //get either ' or ", whatever is first
        
        //if no quotes, will be null
        if (quote){
            let re = new RegExp(quote[1], "g");
            return e.replace(re, ''); //remove outer quotes
        } else {
            return e;
        }
    });
    
    //For each of the splits from above, we can then split among "=" to get our key-value pairs.
    //Since it's already split we don't have to worry about globals.
    const argsRegex = /(.*?)=(.*)/; //Non-greedy first capture group so that future = signs don't mess this up. 
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
 * Given a number, spread it and list all numbers preceeding it. 5 -> 4,3,2,1
 * @param {*} num 
 * @param {*} delim char between numbers
 * @param {*} asc 
 * @returns 
 */
export const sequenceNumber = (num, delim='', asc=false) => {
    var result = '';

    if (!Number.isInteger(num)){
        return '';
    }

    //descending order
    if (flip){
        for (let i = num; i >= 0; i--){
            result += i.toString();
    
            if (i > 0 && delim.length){
                result += delim;
            }
        }
    } else {
        //ascneding order
        for (let i = 0; i <= num; i++){
            result += i.toString();
    
            if (i < num && delim.length){
                result += delim;
            }
        }
    }

    return result;
}