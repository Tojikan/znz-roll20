const fs = require('fs');
const path = require('path');
const FunkContext = require('./FunkContext');




module.exports = new FunkContext(
    './data',
    /***
     * Funks
     * 
     * These are functions we can inject into our Funks context. Therefore, Funks can have predetermined functions that you could just call without having it
     * 
     * Call a function with (([[  funcName() ]]))
     */
    {
        /**
         * This allows you to run a callback function when you just need pure flexibility. The callback is passed all the json data as an object
         * 
         * @param {function} fn Callback Function to be run.
         */
        runFunction: function(fn){
            
            if (typeof fn !== 'function'){
                throw("runFunction error - Invalid parameter type. The parameter must be a function.");
            }
            return fn(this.data);
        },

        /**
         * Retrieves data given a dot notation and then calls a callback on that data. Allows you to transform a specific piece of data.
         * 
         * @param {string} notation String notation to get to the property. You should not include "data." at the beginning - instead directly access via the filename
         * @param {function} callback Callback function to transform data with. Accepts parameter which is the data retrieved from the file. Returns what is returned by the callback.
         */
        transformData: function(notation, callback = function(d){return d;}){
            if (typeof callback !== 'function'){
                throw("runFunction error - Invalid parameter type. The parameter must be a function.");
            }

            //https://stackoverflow.com/questions/639Q3943/convert-javascript-string-in-dot-notation-into-an-object-reference
            var data = notation.split('.').reduce((o,i)=>o[i], this.data);

            return callback(data);
        },
        

        /**
         * Searches through all JSON files for an object with a given property that has a given value.
         * For doing a lookup for a specific object in all files
         * 
         * @param {string} prop Object property to search in.
         * @param {string} val Value of the property to search for.
         * @param {string} location Search in a specific file only. Give the string name of file without extension.
         */
        searchProperty: function(prop, val, location = null){

            var result = null;
            /**
             * Recursive function to handle the searching for any property in a given object.
             * @returns the object if found else null if not found.
             */
            var recursiveSearch = function(prop, val, object){
                // Fail case - nothing has been found
                if (object == null){
                    return null; 
                }

                //Success case - find property
                if (typeof object === "object" && prop in object && object[prop] == val) {
                    return object;
                }     
                //Array - search search array
                else if (typeof object == "array"){
                    for (let arrItem of array){
                        let found = recursiveSearch(prop, val, arrItem);

                        if (found) return found;
                    }
                } 
                //Object - search all properties in object
                else if (typeof object == "object"){
                    for (let key of Object.keys(object)){
                        let found = recursiveSearch(prop, val, object[key]);

                        if (found) return found;
                    }
                }

                //End case - not an object or array
                return null;
            }


            found = recursiveSearch(prop, val, this.data);

            if (found){
                result = found;
            }
    
            if (result){
                return result;
            } else {
                if (this.logError) `Did not locate an object with Property '${prop}' that had value '${val}'`;
                return '';
            }
        }
    },
    /***** 
     * Reusables
     * 
     * These are functions that we want to use in multiple API Scripts and Sheet workers. However, as API scripts are uploaded independently one at a time, we can't reference a shared library
     * However, at the build level, we can just use a funk to directly inject our function into a file as a pure string, letting you just "include" functions wherever you need.
     * 
     * Get a reusable with (([[ getReusable('functionName') ]]))
     *
     * ***********/
    {
        splitArgs: function(input) {
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
        getCharacter: function(sender, msg, args){
            /**
             * Returns character of selected token if it is controlled by selector.
             */
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
        },
        attrLookup: function(name, id){
            /**Get Roll20 Attr */
            return findObjs({type: 'attribute', characterid: id, name: name})[0];
        },
        capitalizeWord: function(word){
            /**Capitalize First Letter */
            if (typeof word !== 'string'){
                return ''
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        },
        filterInt: function(value){
            if (/^[-+]?(\d+)$/.test(value)) {
                return Number(value)
            } else {
                return NaN
            }
        }
    }
);

