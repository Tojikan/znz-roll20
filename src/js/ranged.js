var Ranged = Ranged || (function() {
    'use strict';


    var HandleInput = function(msg) {
        log(msg)
        if (!msg.content.startsWith("!!ranged")){
            return;
        }

        let sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            token,
            character,
            isSelected = false;
        
        //Get character from sending player's selected token
        if ("selected" in msg){
            token = getObj('graphic', msg.selected.id);
            // character = getObj('character', token.get('represents'));

            if (character){
                isSelected = true;
            }
        }

        if (!isSelected){
            sendMessage("You must select a token with a valid character sheet before firing!", sender, true);
            return;
        }
        
        let args = msg.content.split(/\s+/);
        log(args);
        






    },
    sendMessage = function(message, who, whisper) {
		sendChat(
            'Fire Ranged Weapon',
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
	Ranged.RegisterEventHandlers();
});