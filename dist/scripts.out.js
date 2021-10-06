(function () {
    'use strict';

    function attrAlert(obj, prev){
        const watchedAttr = [
            "health",
            "energy",
            "weaponslots",
            "equipmentslots",
            "inventoryslots"
        ];
        const ammoId = "ammo";
        const ammoTypes = ["d4","d6","d8","d10","d12","d20"];
        let attr = '';

        for (let ammo of ammoTypes){
            watchedAttr.push(`${ammoId}_${ammo}`);
        }

        if (watchedAttr.includes(obj.get("name"))){
            attr = obj.get("name");
        } else {
            return;
        }


        let textColor = '#456C8B',
            bgColor = '#CCE8F4',
            prevVal = prev['current'], //prev is a basic object without getters/setters
            curVal = obj.get('current'),
            character = getObj('character', obj.get('_characterid'));

        if (prevVal == curVal){
            return;
        }


        sendChat(
            'Attribute Alert',
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')}'s ${attr} attribute was changed!</strong><div> <div>Previous Value:  ${prevVal}</div><div> New Value: ${curVal} .</div></div>`
        );

        if (curVal <= 0){
            textColor = '#8B0000';
            bgColor = '#FFA07A';
            sendChat(
                'Attribute Alert - Reached Zero!',
                `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} reached 0 ${attr} points!</strong></div>`
            );
        }    
    }

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
     function splitArgs (input) {
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
                if ( !isNaN(value)){value = parseInt(match[2], 10);}
                if ( value === 'true'){value = true;}
                if ( value === 'false'){value = false;}

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
            !_.contains(character.get('controlledby').split(','),'all')){
                return null;
            }

        } else {
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
    var getAttrVal = function(character, attr){
        return findObjs({type: 'attribute', characterid: character.id, name: attr})[0];
    };

    function handleReload(character, weaponId){
        const getAttrName = function(id, num){
            return `weapon_${id}_${num}`;
        };    

        const itemType = getAttrVal(character, getAttrName("itemtype", weaponId)),
            weaponType = getAttrVal(character, getAttrName("weapontype", weaponId)),
            ammoType = getAttrVal(character, getAttrName("ammotype", weaponId)),
            ammo = getAttrVal(character, getAttrName("uses", weaponId)),
            active = getAttrVal(character, 'weapon' + '_' + weaponId);

            log(active);
            
            if (!active){
                return {msg: "Error! Could not check item active!", type: "error"};
            } else if (!itemType){
                return {msg: "Error! Could not get item type!", type: "error"};
            } else if (!weaponType){
                return {msg: "Error! Could not get weapontype!", type: "error"};
            } else if (!ammoType){
                return {msg: "Error! Could not get ammotype!", type: "error"};
            } else if (!ammo){
                return  {msg: "Error! Could not get ammo!", type: "error"};
            } else if (itemType.get('current') !== 'weapon'){
                return {msg: "Error! Item is not a weapon!", type: "error"};
            } else if (weaponType.get('current') !== 'ranged'){
                return {msg: "Error! Item is not a ranged weapon!", type: "error"};
            }
            
            const ammoMax = ammo.get("max"),
                ammoStore = getAttrVal(character, ammoType.get('current')), //ammoType dropdown values are the attribute for the appropriate ammo store.
                isActive = active.get('current');
        
        if (!isActive){
            return  {msg: `Weapon ${weaponId} is not active!`, type: "warning"};
        } else if (!ammoMax){
            return  {msg: "Error! Could not get max ammo!", type: "error"};
        } else if (!ammoStore){
            return  {msg: "Error! Could not get ammo store!", type: "error"};
        }
        
        const current = parseInt(ammo.get('current'), 10) || 0,
            max = parseInt(ammoMax, 10) || 0,
            store = parseInt(ammoStore.get('current'), 10) || 0,
            reload = max - current,
            ammoText = ammoType.get('current').replace('ammo_', '');

        if (current >= max){
            return  {msg: "Weapon is already at max ammo!", type: "info"};
        }

        if (store <= 0){
            //No Ammo
            return {msg: `${character.get('name')} has no ${ammoText} ammo to reload with.`, type:"warning"}
        } else if (reload >= store){
            //Successful Reload - Partial Reload
            ammo.setWithWorker({current: store + current});
            ammoStore.setWithWorker({current: 0});
            return {msg: `${character.get('name')} reloads with the last of their ${ammoText} ammo.`, type:"warning"}
        } else {
            //Successful Reload - Full Reload
            ammo.setWithWorker({current: max});
            ammoStore.setWithWorker({current: store - reload});
            return {msg: `${character.get('name')} reloads. They have ${store - reload} ${ammoText} ammo remaining.`, type:"success"}
        }
    }

    var Main = Main || (function(){
        const HandleInput = function(msg) {

            if (msg.type !== "api"){
                return;
            }

            const args = splitArgs(msg.content),
                sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
                character = getCharacter(sender, msg, args);

            if (!character){
                sendMessage("You must select a valid character that you control!", sender, 'error');
                return;
            }

            if (msg.content.startsWith("!!reload")){
                if (!("weapon" in args)){
                    sendMessage('You must specify a valid weapon (i.e. weapon=1  or weapon=2, etc)', sender, 'error');
                    return
                }

                const response = handleReload(character, args.weapon);

                sendMessage(response.msg, "Reload Script", response.type);
                return;
            }
        };
        
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
            }


            sendChat(
                `${who}`,
                `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;">${msg}</div>`
    		);
        };
        

        
        
        const RegisterEventHandlers = function() {
    		on('chat:message', HandleInput);
            on('change:attribute', attrAlert);
    	};

        return {
            RegisterEventHandlers: RegisterEventHandlers
        }
    })();
    on("ready", function(){
        Main.RegisterEventHandlers();
    });

})();
