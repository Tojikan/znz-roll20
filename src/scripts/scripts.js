import { splitArgs } from "../lib/znzlib";
import { getCharacter, sendMessage } from "../lib/roll20";
import { FatigueRoll } from "./fatigueroll";

/**
 * Main Entrypoint into the API. 
 * API Scripts are registered to this object. You can have Callers (in response to chat message) or Watchers (in response to attribute changes)
 * 
 * This will loop over all Callers/Watchers and add input in there.
 */
const Main = (function(){

    const callers = {};
    const watchers = [];
    const prefix = '!!';

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
            log(prefix + api);
            if (msg.content.startsWith(prefix + api)){
                try {
                    //run the funciton
                    callers[api](args, character, sender);
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

    
    //Init Scripts
    const init = function() {
        on('chat:message', HandleInput);
        on('change:attribute', HandleAttributeChange);
	};


    return {
        init: init,
        RegisterCaller: RegisterCaller,
        RegisterWatcher: RegisterWatcher
    }
})();


on("ready", function(){
    Main.RegisterCaller('fatroll', FatigueRoll);
    Main.init();
});