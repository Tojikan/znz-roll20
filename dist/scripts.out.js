(function () {
    'use strict';

    /////// Library of Functions for Generic Use



    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
     * Post a formatted text to chat.
     * @param {*} msg 
     * @param {*} who 
     * @param {*} type 
     * @returns 
     */   
    function sendMessage (msg, who, type){
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

    class Model {
        constructor(model){
            this.model = model;
        }
        
        /**
         * Exports a model's fields into JSON. Generates an ID and label for each top level key in an object.
         * @param {boolean} flatten flatten lists into the main object so everything is 1 dimensional. This is dangerous as this will overwrite keys so make sure all keys are unique
         * @returns 
         */
        toJson(flatten=false){
            let keys = Object.keys(this.model);
            let retVal = {};
            
            // Inner function for setting ID and Label
            const setupField = function(key, obj, prefix=''){
                let result = {...obj};
                
                //Set ID based on key if none provided
                if (!('id' in obj)){
                    result.id = key;
                }
            
                //Set label based on key if none provided
                if (!('label' in obj)){
                    result.label = capitalize(key);
                }   
            
                //Add prefix to the id.
                if (prefix.length){
                    result.id = `${prefix}_${result.id}`;
                }
                
                return result;
            };
            
            for (let k of keys){
                let obj = this.model[k];
                
                //For lists fields (such as skills), set up for each item in the list
                if (obj && 'list' in obj){
                    retVal[k] = {...obj, list:{}};
            
                    for (let opt of Object.keys(obj.list)){
                        //add a prefix to the option id
                        retVal[k].list[opt] = setupField(`${opt}`, obj.list[opt], k);
                    }
                    
                    //If flatten, merge it back into the main object, deleting the original list.
                    if (flatten){
                        retVal = {...retVal, ...retVal[k].list};
                        delete retVal[k].list;
                    }

                } else {
                    retVal[k] = setupField(k, obj);
                }
            }
            
            return retVal;

        }
    }

    const CharacterModel = new Model(
        {
            health: {
                default: 100,
                max: true
            },
            fatigue: {
                affects: 'rolls'
            },
            trauma: {
                affects: 'success'
            },
            actions: {
                max: true,
                default: 3,
                action: 'refreshAP',
                actionlabel: 'refresh'
            },
            rollmod: {},
            rollcost: {},
            ammo: {
                list: {
                    ammolight: {label: 'Light'},
                    ammomedium: {label: 'Medium'},
                    ammoheavy: {label: 'Heavy'}
                }
            },
            body: { default: 10 },
            mind: { default: 10 },
            spirit: { default: 10 },
            skills: {
                list: {
                    melee: { uses: 'body', label: 'Melee Combat'},
                    blocking: { uses: 'body' },
                    dodging: { uses: 'body' },
                    ranged: { uses: 'body', label: 'Ranged Combat' },
                    throwing: { uses: 'body' },
                    athletics: { uses: 'body' },
                    endurance: { uses: 'body' },
                    stealth: { uses: 'body' },
                    
                    crafting: { uses: 'mind' },
                    learning: { uses: 'mind' },
                    vehicles: { uses: 'mind' },
                    engineering: { uses: 'mind' },
                    science: { uses: 'mind' },
                    medicine: { uses: 'mind' },
                    investigation: { uses: 'mind' },
                    nature: { uses: 'mind' },
                    
                    scouting: { uses: 'spirit' },
                    reflexes: { uses: 'spirit' },
                    tenacity: { uses: 'spirit' },
                    socialskills: {uses: 'spirit', label: 'Social Skills'},
                    thievery: { uses: 'spirit' },
                    emotions: {uses: 'spirit'},
                    insight: {uses: 'spirit'},
                    survival: { uses: 'spirit' }
                }
            }
        }
    );

    // export const CharacterModel = {
        // notes: {},
        // ammo: {
        //     type: 'list',
        //     list: {
        //         light:{},
        //         medium:{},
        //         heavy:{},
        //         arrow:{}
        //     }
        // },
        // health: {
        //     type: 'max'
        // },
        // fatigue: {
        //     type: 'max'
        // },
        // actions: {
        //     type: 'max'
        // },
        // equipmentslots: {
        //     default: 2,
        //     max: 6
        // },
        // inventoryslots: {
        //     default: 5,
        //     max: 12
        // },
        // ability: {
        //     options: {
        //         _default: {
        //             label: "Select an ability"
        //         },
        //         scavenger: {
        //             description: "Draw 1 additional cards when you scavenge. If you are scavenging a location alone, draw 3."
        //         },
        //         sniper: {
        //             description: "Take aim - don't take any actions this turn. Roll them as free ranged attack actions next turn. You lose these free attacks if you do any action other than ranged attack prior to using them."
        //         }
        //     }
        // },
        // combatskills: {
        //     type:'list',
        //     list: {
        //         guard: {
        //             label: "Guard"
        //         },
        //         throw: {
        //             label: "Throw"
        //         },
        //         blunt: {
        //             label: "Blunt Melee"
        //         },
        //         firearm: {
        //             label: "Firearm"
        //         },
        //         sharp: {
        //             label: "Sharp Melee"
        //         },
        //         unarmed: {
        //             label: "Unarmed"
        //         },
        //         projectile: {
        //             label: "Projectile"
        //         }
        //     }
        // },
        // skills: {
        //     type: 'list',
        //     list: {
        //         lockpick: {
        //             label: "Lockpick"
        //         },
        //         scout: {
        //             label: "Scout"
        //         },
        //         stealth: {
        //             label: "Stealth"
        //         },
        //         social: {
        //             label: "Social"
        //         },
        //         firstaid: {
        //             label: "First Aid"
        //         },
        //         construction: {
        //             label: "Construction"
        //         },
        //         hacking: {
        //             label: "Hacking"
        //         },
        //         athletics: {
        //             label: "Athletics"
        //         }
        //     }
        // }
    // }

    class PlayerCharacter{

        /**
         * Set up character
         * @param {object} characterObj Object from Roll20, retrieve via findObjs or some other function
         */
        constructor(characterObj, getHandler, setHandler){
            this.character = characterObj;
            this.name = this.character.get('name');
            this.id = this.character.get('id');
            this.model = CharacterModel.toJson(true); //flatten the json to 1 dimensional to make it easier for our proxy
            this.fieldGetMax = false; //changeable property so that the proxy getter can get max


            /***
             * Setup a proxy so that accessing or setting a property in this.data will directly get/set it from Roll20
             * The proxy will call getAttrVal or setAttr when you get/set
             * 
             * This is definitely overkill but fun to learn soooo.. worth?
             * https://stackoverflow.com/questions/60218309/creating-dynamic-getters-and-setters-from-a-base-object-in-javascript
             * https://stackoverflow.com/questions/41299642/how-to-use-javascript-proxy-for-nested-objects
             */
            const modelProxy = {
                get: function(target, key) {
                    
                    // doing it this way lets us overwrite the handler in the constructor, which makes it easier to unit test or something
                    let handler = (getHandler || function(target, key){
                        if ('id' in target[key]){
                            let val = getAttrVal(target[key].id);
                            return ( Number(val, 10) || val );
                        } else {
                            return null;
                        }

                    });

                    return handler(target, key);
                },
                set: function(target, key, value) {

                    let handler = (setHandler || function(target, key, value){
                        if ('id' in target[key]){
                            setAttrVal(target[key].id, value);
                        } 
                        return true;
                    });

                    return handler(target, key, value)
                }
            };
            this.data = new Proxy(this.model, modelProxy);
        }

        /**
         * Retrieve an attribute object
         * @param {*} attribute 
         * @returns The Attribute object
         */
        getAttr = function(attr){
            return findObjs({type: 'attribute', characterid: this.character.id, name: attr})[0];
        }


        /**
         * Wrapper around roll20's getAttrByName. 
         * Gets the value of an attribute but uses the field's default value if not present.
         * 
         * @param {string} attr name of the attribute
         * @param {boolean} forceGetMax get Max value instead of current if set to true.
         * @returns 
         */
        getAttrVal(attr, forceGetMax=false){
            return getAttrByName(this.character.id, attr, (forceGetMax || this.fieldGetMax ? 'max' : 'current'));
        }    

        /**
         * Set Value of an attribute
         * 
         * @param {string} attr attribute name
         * @param {*} value value to set to
         */
        setAttrVal(attr, value){
            let attribute = getAttr(attr);

            if (!attribute){
                return null;
            }

            let prev = attribute.get('current');
            attribute.setWithWorker({current: value});

            return {
                prev: prev,
                value: value
            }
        }
    }

    const FatigueRoll = function(args, char, sender){
        if ('help' in args) {
            let output = `&{template:default} {{name=Basic Fatigue Roll Instructions}} {{instructions=Roll while adding fatigue/spending actions. Select character. Then roll with the following parameters}}`;
            output += `{{pool=Set number of dice to roll}}`;
            output += `{{target=Set target number for success}}`;
            output += `{{Example Command='!!fatroll pool=10 target=3' ==== rolls 10d10<3}}`;
            sendChat(sender, output);
            return;
        }


        if (!char){
            throw (`FatigueRoll Error - a character was not provided!`);
        }


        const rollArgs = verifyRollArgs(args),
            character = new PlayerCharacter(char),
            dice = 10, //assuming we stick with a d10? Change if needed
            hasCost = character.data.rollcost,
            poolMod = character.data.rollmod,
            stdCost = 3;

            
            
        let output = `&{template:default} {{name=${rollArgs.name || `${character.name} attemmpts a roll!`}}} `;
        let rollText = generateRollText(dice, rollArgs.pool + poolMod - character.data.fatigue, rollArgs.target);

        if (hasCost){
            if (character.data.actions > 0){
                character.data.fatigue += stdCost;
                character.data.actions -= 1;
            } else {
                output += ` {{failure=${character.name} does not have enough actions remaining!}} `;
                sendChat(sender, output);
                return;
            }
        }

        output += ` {{Roll Result= [[[[${rollText}]]-[[${character.data.trauma}]]]]}}`;
        sendChat(sender, output);
    };






    function generateRollText(dice, pool, target){
        return `{${pool}d${dice}}<${target}`;
    }

    function verifyRollArgs(args){

        const expectedArgs = ['pool', 'target'];

        for (let arg of expectedArgs) {
            if (arg in args){
                let val = parseInt(trim(args[arg]), 10);

                if (isNaN(val)){
                    throw(`FatigueRoll Error - '${arg}' must be an integer!`);
                }

                args[arg] = val;
            }
            
            throw(`FatigueRoll Error - Missing required parameter '${arg}'`);
        }

        return args;
    }

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

})();
