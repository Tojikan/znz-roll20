import { attrAlert } from "./attrAlert";
import { handleReload } from "./reload";
import { handlePickup } from "./pickup";
import { handleAttack } from "./attack";
import { splitArgs, getCharacter, regexGetRowId } from "./_helpers";


var Main = Main || (function(){
    const HandleInput = function(msg) {

        if (msg.type !== "api"){
            return;
        }

        //Initial Validation
        const args = splitArgs(msg.content),
            sender=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname'),
            character = getCharacter(sender, msg, args);

        if (!character){
            sendMessage("You must select a valid character that you control!", sender, 'error');
            return;
        }

        // Reload
        if (msg.content.startsWith("!!reload")){
            if (!("weapon" in args)){
                sendMessage('You must specify a valid weapon (i.e. weapon=1  or weapon=2, etc)', sender, 'error');
                return
            }

            const response = handleReload(character, args.weapon);

            sendMessage(response.msg, "Reload Script", response.type);
            return;
        }


        //Pickup
        if (msg.content.startsWith("!!pickup")){
            const response = handlePickup(character, args);

            sendMessage(response.msg, "Pickup Script", response.type);
            return;
        }


        //attack
        if (msg.content.startsWith("!!attack")){
            const response = handleAttack(character, args);

            if ('roll' in response){
                sendChat('Attack Script', `${character.get('name')} makes an attack!`);
                sendChat('Attack Script', `/roll ${response.roll}`);
            }

            if (response.msg){
                sendMessage(response.msg, 'Attack Script', response.type);
            }

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