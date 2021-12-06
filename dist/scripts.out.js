(function () {
    'use strict';

    /////// Library of Functions for Generic Use


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
     function splitArgs (input) {
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
                if ( !isNaN(value)){value = parseInt(match[2], 10);}
                if ( value === 'true'){value = true;}
                if ( value === 'false'){value = false;}

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

    /////// Library of Functions for Interacting with Roll20 APIs


    /**
     * Gets a player's selected character. Only returns the character if the player controls the Character or is a GM
     * 
     * @param {*} sender 
     * @param {*} msg 
     * @param {*} args 
     * @returns 
     */
     function getCharacter(sender, msg, args = {}){
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

        } else {
            return null;
        }

        return character;
    }

    /**
     * Main Entrypoint into the API. 
     * API Scripts are registered to this object. You can have Callers (in response to chat message) or Watchers (in response to attribute changes)
     * 
     * This will loop over all Callers/Watchers and add input in there.
     */
    var Main = Main || (function(){

        const callers = {};
        const watchers = [];
        const prefix = '!!';

        //Init Scripts
        const init = function() {
            on('chat:message', HandleInput);
            on('change:attribute', HandleAttributeChange);
    	};

        /**
         * Register Callers. Add in API Scripts through this function.
         * 
         * @param {string} command Will call the function upon seeing this string in chat (if string is prepended with !!). This should be a valid JS variable string.
         * @param {function} callFunction A function to be called when the command is issued.
         * @returns 
         */
        const RegisterCaller = function(command, callFunction){             
            callers[command] = callFunction;
        };

        /**
         * Register Watchers. Add in scripts that monitor attribute changes through this function
         * 
         * @param {function} watchFunction A function to be called when attributes are changed
         */
        const RegisterWatcher = function(watchFunction){
            watchers.push(obj);
        };

         /**
         * Main router function for calling Callers. Takes an API chat message, parses its args, and then matches it to a caller.
         * 
         * Calls each caller by passing in the parsed args and character
         * 
         * @param {*} msg chat message
         * @returns 
         */
        const HandleInput = function(msg) {
            if (msg.type !== "api"){
                return;
            }

            // Setup our character and args.
            const args = splitArgs(msg.content),
                sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
                character = getCharacter(sender, msg, args);

            // Go through our registered APIs and call as appropriate
            for (const api in callers){
                if (msg.content.startsWith(prefix + api)){
                    try {
                        //run the funciton
                        callers[api](args, character);
                    } catch(err){
                        log(err);
                        log(err.stack);
                        sendMessage(err, 'Error: ' + api, 'error');
                    }
                }
            }
        };

        // Single function call for all attribute watchers
        const HandleAttributeChange = function(obj, prev){
            for (let watcher of attrWatchers){
                try {
                    watcher(obj, prev);
                } catch(err){
                    log(err);
                    log(err.stack);
                    sendMessage(err, 'Error in attribute watcher:', 'error');
                }
            }
        };
        

        return {
            init: init,
            RegisterCaller: RegisterCaller,
            RegisterWatcher: RegisterWatcher
        }
    });

    on("ready", function(){
        Main.init();
    });

})();
