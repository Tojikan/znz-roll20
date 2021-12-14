import { attrAlert } from "./attrAlert";
import { reload } from "./reload";
import { pickup } from "./pickup";
import { RollAP } from "./rollAP";
// import { attack } from "./attack";
// import { combat } from './combat';
import { splitArgs, getCharacter } from "./_archive/_helpers";
import { cardDeck } from "./deck";

/**
 * Main handler. We register our API Scripts into this so we can have a single caller for all api scripts.
 */

var Main = Main || (function(){

    const apiCallers = {};
    const attrWatchers = [];

    /**
     * Register API Callers. Hook for adding in new APIs into this main one.
     * 
     * @param {*} obj - Expects an object which contains 'caller' - msg in api to trigger the script - and 'handler' - function that does the api work based off the passed in args.
     * @returns 
     */
    const RegisterApiCaller = function(obj){
        if (!('caller' in obj) || !('handler' in obj)){
            return;
        }

        apiCallers[obj.caller] = {
            handler: obj.handler
        }

        if ('responder' in obj){
            apiCallers[obj.caller].responder = obj.responder;
        } else {
            apiCallers[obj.caller].responder = standardResponder;
        }
    }


    /**
     * Add an attribute watcher.
     */
    const RegisterAttrWatcher = function(obj){
        attrWatchers.push(obj);
    }

    /**
     * Default responder, which just prints out a message of a given type.
     * @param {*} obj 
     * @param {*} sender 
     * @param {*} character 
     */
    const standardResponder = function(obj, sender, character){
        if ("msg" in obj && "type" in obj){
            sendMessage(obj.msg, sender, obj.type);
        }
    }

    /**
     * Router function. Takes a chat msg that begins with an API and then matches it to an API Caller thats
     * registered to this. Then call the appropriate handler and responder 
     * 
     * @param {*} msg 
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
        for (const api in apiCallers){
            if (msg.content.startsWith(api)){
                try {
                    let caller = apiCallers[api];
    
                    // Flow - API handles the args, and then sends it to a responder to do the rest.
                    let response = caller.handler(args, character);
                    caller.responder(response, sender, character);
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
                log(watcher);
                log(err);
                log(err.stack);
                sendMessage(err, 'Error in attribute watcher:', 'error');
            }
        }
    }

    /**
     * Post a formatted text to chat.
     * @param {*} msg 
     * @param {*} who 
     * @param {*} type 
     * @returns 
     */   
    const sendMessage = function(msg, who, type){
        let textColor = '#000',
            bgColor = '#fff';

        switch (type){
            case "error":
                textColor = '#C14054';
                bgColor = '#EBC8C4';
                break;
            case "info":
                bgColor = '#CCE8F4';
                textColor = '#456C8B';
                break;
            case "warning":
                bgColor = '#F8F3D6';
                textColor = '#8B702D';
                break;
            case "success":
                bgColor = '#baedc3';
                textColor = '#135314';
                break;
            case "header":
                sendChat(
                    `${who}`,
                    `<h3 style="border: solid 1px black; background-color: white; padding: 5px;">${msg}</h3>`
                );             
                return;
        }

        sendChat(
            `${who}`,
            `<div style="padding:3px; border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 120%;">${msg}</div>`
		);
    }
    
    const init = function() {
        on('chat:message', HandleInput);
        on('change:attribute', HandleAttributeChange);
	};
    
    return {
        init: init,
        RegisterApiCaller: RegisterApiCaller,
        RegisterAttrWatcher: RegisterAttrWatcher
    }
})();


on("ready", function(){
    Main.RegisterApiCaller(cardDeck);
    Main.RegisterApiCaller(pickup);
    Main.RegisterApiCaller(reload);
    Main.RegisterApiCaller(RollAP);
    // Main.RegisterApiCaller(attack);
    // Main.RegisterApiCaller(combat);
    Main.RegisterAttrWatcher(attrAlert);
    Main.init();
});