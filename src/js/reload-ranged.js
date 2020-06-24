var Reload = Reload || (function() {
    'use strict';
    const RELOADS_ATTR = "equipped_ranged_reloads",
    AMMO_ATTR = "equipped_ranged_ammo",

    HandleInput = function(msg) {
        if (msg.type !== "api") {
			return;
        }
        
        if (!msg.content.startsWith("!!reload")){
            return;
        }

        let sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            token,
            character;
        
        //Get character from sending player's selected token
        if ("selected" in msg){
            token = getObj('graphic', msg.selected[0]._id);

            if (token){
                character = getObj('character', token.get('represents'));
            }
        }

        //Validate player contorl. 
        if (character){
            if(
                ! playerIsGM(msg.playerid) && 
                !_.contains(character.get('controlledby').split(','),msg.playerid) &&
                !_.contains(character.get('controlledby').split(','),'all')
            ) {
                sendMessage('You do not control the selected character', sender, true);
                return;
            }

        } else{
            sendMessage("You must select a token with a valid character sheet!", sender, true);
            return;
        }

        //Handle Reload
        let reloads = attrLookup(character, RELOADS_ATTR),
        ammo = attrLookup(character, AMMO_ATTR);
        
        if (!reloads.get("current") || !ammo.get("max")){
            sendMessage("Your character either has no ranged weapon equipped or the reloads / max Ammo field(s) is empty!", sender, true);
            return;
        }

        let currReloads = parseInt(reloads.get("current"), 10) || 0,
            ammoMax = parseInt(ammo.get("max"), 10) || 0;


        if (currReloads <= 0){
            sendMessage(character.get('name') + " has no more reloads...", sender, false);
            return;
        } else if (currReloads === 1){
            sendMessage(character.get('name') + " has only one more reload. Make it count.", sender, false);
        }

        sendMessage(character.get('name') + " reloads their ranged weapon!", sender, false);
        ammo.setWithWorker({current: ammoMax});
        reloads.setWithWorker({current: (currReloads - 1)});

    },
    attrLookup = function(character, name){
        return findObjs({type: 'attribute', characterid: character.id, name: name})[0];
    },
    sendMessage = function(message, who, whisper) {
		sendChat(
            'Reload Ranged Weapon',
            `${(whisper||'gm'===who)?`/w ${who} `:''}<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">${message}</div>`
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