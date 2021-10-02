import { rollTable } from "./rolltable";


var Main = Main || (function(){
    const original = [1, 2, 3, 4, 5]
    var cards = [...original];

    const HandleInput = function(msg) {

        if (msg.content.startsWith("!!roll")){

            let random = randomInteger()
            cards.pop();

            log(cards);
        }

        if (msg.content.startsWith("!!shuffle")){
            cards = [...original];

            log(cards);
        }
    }
    
    
    const Scavenge = function(){
        
        sendChat('', `/roll 1d100`, function(ops) {
            // ops will be an ARRAY of command results.
            var rollresult = ops[0];

            log(rollresult);

        });
    }
    
    
    RegisterEventHandlers = function() {
		on('chat:message', HandleInput);
	};

    return {
        RegisterEventHandlers: RegisterEventHandlers
    }
})();



on("ready", function(){
    Main.RegisterEventHandlers();
});