import { attrAlert } from "./attrAlert";
import { handleReload } from "./reload";
import { handlePickup } from "./pickup";
import { handleAttack } from "./attack";
import { splitArgs, getCharacter } from "./_helpers";


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
        // if (msg.content.startsWith("!!reload")){
        //     if (!("weapon" in args)){
        //         sendMessage('You must specify a valid weapon (i.e. weapon=1  or weapon=2, etc)', sender, 'error');
        //         return
        //     }

        //     const response = handleReload(character, args.weapon);

        //     sendMessage(response.msg, "Reload Script", response.type);
        //     return;
        // }


        //Pickup
        if (msg.content.startsWith("!!pickup")){
            const response = handlePickup(character, args);

            sendMessage(response.msg, sender, response.type);
            return;
        }


        //attack
        if (msg.content.startsWith("!!attack")){
            const response = handleAttack(character, args);

            let rollmsg = `&{template:default} {{name=${character.get('name')} makes an attack!}} `;

            if (response.results){
                for (let line of response.results){
                    rollmsg += ` {{ ${line.type}= ${line.msg} }} `
                }
            }

            // Display attack roll response.
            if ('roll' in response){
                sendChat('', `/roll ${response.roll}`, function(obj){
                    let rollResult = JSON.parse(obj[0].content);
                    log("Attack: " + rollResult.total);

                    //We get a super nested result since its in a group. So just hardcode it and hope the result stays in the same format
                    let rollText = rollResult.rolls[0].rolls[0][0].results.map(x => `[[${x.v}]]`).join(' ') || '';

                    rollmsg += `{{Attack Rolls= ${rollText}}} {{Attack Result = [[${rollResult.total}]]}}`;

                    sendChat(sender, rollmsg); //because sendChat is asynch, we have to call this here in a separate condition
                });
            } else {

                sendChat(sender, rollmsg);
            }


            // Display Defense Roll Response
            if ('defenseResults' in response){

                log(response);

                let defensemsg = `&{template:default} {{name=${character.get('name')} Defends!}} `;

                for (let line of response.defenseResults){
                    defensemsg += ` {{ ${line.type}= ${line.msg} }} `
                }
                if ('defenseRoll' in response ){
                    sendChat('', `/roll ${response.defenseRoll}`, function(obj){
                        let rollResult = JSON.parse(obj[0].content);
                        log("Defense: " + rollResult.total);
    
                        //We get a super nested result since its in a group. So just hardcode it and hope the result stays in the same format
                        let rollText = rollResult.rolls[0].rolls[0][0].results.map(x => `[[${x.v}]]`).join(' ') || '';
    
                        defensemsg += `{{Defense Rolls= ${rollText}}} {{Result = [[${rollResult.total}]]}}`;
    
                        sendChat(sender, defensemsg); //because sendChat is asynch, we have to call this here in a separate condition
                    });
                } else {
                    sendChat(sender, defensemsg);
                }

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
            case "header":
                sendChat(
                    `${who}`,
                    `<h3 style="border: solid 1px black; background-color: white; padding: 5px;">${msg}</h3>`
                );             
                return;
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