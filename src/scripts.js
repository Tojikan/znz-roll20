import { HandleAttack } from './scripts/attack';
import { attrAlert } from './scripts/attrAlert';
import { HandleAttrRoll } from './scripts/attrRoll';
import { HandlePickup } from './scripts/pickup';
import { HandleReload } from './scripts/reload';
import { LootDeck } from './scripts/lootDeck';


var Main = Main || (function(){

    const lootDeck = LootDeck(); //Deck gets initiated in function

    const handlers = [
        {name:"Reload Script", fn:HandleReload},
        {name:"Attribute Roll Script", fn:HandleAttrRoll},
        {name:"Attack Roll Script", fn:HandleAttack},
        {name:"Pickup Script", fn:HandlePickup},
        {name:"Loot Deck Script", fn:lootDeck.handleDeck}, // This one is a closure.
    ];
    const watchers = [
        {name:"AttrWatch", fn:attrAlert}
    ];

    const HandleInput = function(msg){
        if (msg.type !== "api"){
            return;
        }

        for (let handle of handlers) {
            try {
                handle.fn(msg);
            } catch(err){
                log(err);
                log(err.stack);
                sendMessage(err, `Error in ${handle.name}`, 'error');
            }
        }
    }

    const HandleAttributeChange = function(obj, prev){
        for (let watcher of watchers){
            try {
                watcher.fn(obj, prev);
            } catch(err){
                log(err);
                log(err.stack);
                sendMessage(err, `Error in ${watcher.name}`, 'error');
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
    }
})();

on("ready", function(){
    Main.init();
});