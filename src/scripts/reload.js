var Reload = Reload || (function() {
    'use strict';
    const AMMO_ATTR = "(([[getProperty('prefixes.ranged')]]))_(([[searchProperty('canonical', 'rangedAmmo', 'items').attr_name]]))";
    const AMMO_TYPE_ATTR = "(([[getProperty('prefixes.ranged')]]))_(([[searchProperty('canonical', 'rangedAmmoType', 'items').attr_name]]))";


    const HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }
        
        if (!msg.content.startsWith("!!reload")){
            return;
        }
        var sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            character = getCharacter(sender, msg);


        if (!character){
            sendMessage("You must select your character's token to pick up an item!", sender, true, "danger");
            return;
        }


        //Handle Reload
        let attrAmmo = attrLookup(character, AMMO_ATTR),
            attrAmmoType = attrLookup(character, AMMO_TYPE_ATTR);

        if (!attrAmmoType || !attrAmmo ){
            sendMessage("Could not find attribute. Please verify this character has an initialized character sheet.", sender, true, "danger");
            return;
        }

        let attrAmmoTypeAmount = attrLookup(character, attrAmmoType.get("current")),
            ammoType = capitalize(attrAmmoType.get("current").replace('ammo_', ''));

        if (!attrAmmoType || !attrAmmo ){
            sendMessage("Could not find attribute. Please verify this character has an initialized character sheet.", sender, true, "danger");
            return;
        }

        
        if (!attrAmmo.get("max")){
            sendMessage("The max ammo field for current ranged weapon is empty!", sender, true, "danger");
            return;
        }

        if (!attrAmmoTypeAmount){
            sendMessage(`Ammo Field for ${ammoType} ammo is empty!`, sender, true, "danger");
            return;
        }

        let currentAmmo = parseInt(attrAmmo.get("current"), 10) || 0,
            ammoMax = parseInt(attrAmmo.get("max"), 10) || 0,
            ammoAmount = parseInt(attrAmmoTypeAmount.get('current'), 10) || 0,
            ammoToSpend = ammoMax - currentAmmo;

        if (currentAmmo == ammoMax){
            sendMessage(`${character.get('name')} is already at max ammo!`, sender, false);
            return;
        }

        if (ammoAmount <= 0){
            sendMessage(`${character.get('name')} has no more ${ammoType} ammo left.`, sender, false, "danger");
            return;
        } else if (ammoToSpend >= ammoAmount) {
            sendMessage(`${character.get('name')} only has ${ammoAmount} ${ammoType} rounds left and uses all of them to reload their weapon. `, sender, false, "warning");

            attrAmmo.setWithWorker({current: currentAmmo + ammoAmount});
            attrAmmoTypeAmount.setWithWorker({current: 0});
        } else {
            sendMessage(`${character.get('name')} reloads ${ammoToSpend} ${ammoType} rounds. They have ${ammoAmount - ammoToSpend} ${ammoType} rounds remaining. `, sender, false);
            attrAmmo.setWithWorker({current: ammoMax});
            attrAmmoTypeAmount.setWithWorker({current: ammoAmount - ammoToSpend});
        }
    },
    capitalize = function(str){
        return str[0].toUpperCase() + str.slice(1);
    },
    getCharacter = function(sender, msg){
        let token,
            character = null;
        
        //Get character from sending player's selected token
        if ("selected" in msg){
            token = getObj('graphic', msg.selected[0]._id);

            if (token){
                character = getObj('character', token.get('represents'));
            }
        }

        //Validate player
        if (character){
            if( ! validatePlayerControl(character, msg.playerid)) {
                sendMessage('You do not control the selected character', sender, true, "danger");
                return null;
            }

        } else{
            sendMessage("You must select a token with a valid character sheet!", sender, true, "danger");
            return null;
        }

        return character;

    },
    attrLookup = function(character, name){
        return findObjs({type: 'attribute', characterid: character.id, name: name})[0];
    },
    validatePlayerControl = function(character, playerId){
        return playerIsGM(playerId) ||  
        _.contains(character.get('controlledby').split(','),playerId) || 
        _.contains(character.get('controlledby').split(','),'all');
    },
    sendMessage = function(message, who, whisper, type="info" ) {
        let textColor = '#006400',
            bgColor = '#98FB98';

        
        switch (type) {
            case "danger":
                textColor = '#8B0000';
                bgColor = '#FFA07A';
                break;
            case "warning":
                textColor = '#8B4513';
                bgColor = '#F0E68C';
                break;
        }


		sendChat(
            `${who}`,
            //broken on prod
            //`${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;">${message}</div>`
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}; font-size: 80%;">${message}</div>`
		);
	},
    RegisterEventHandlers = function() {
		on('chat:message', HandleInput);
	};

	return {
		RegisterEventHandlers: RegisterEventHandlers
	};
}());


on("ready",function(){
	'use strict';
	Reload.RegisterEventHandlers();
});