import { attrAlert } from "./attrAlert";
import { handleReload } from "./reload";
import { splitArgs, getCharacter } from "./_helpers";


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
    }
    

    
    
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