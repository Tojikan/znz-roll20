(function () {
    'use strict';

    function generateFood(val){
        return 'Food';

    }

    function generateMedicine(val){
        return 'Medicine';

    }

    function generateAmmo(val){
        return 'Ammo';

    }

    function generateMelee(val){
        return 'Melee';

    }

    function generateRanged(val){
        return 'Ranged';

    }

    function generateEquipment(val){
        return 'Equipment';

    }

    function generateSuper(){
        return 'Super';
    }

    var generator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        generateFood: generateFood,
        generateMedicine: generateMedicine,
        generateAmmo: generateAmmo,
        generateMelee: generateMelee,
        generateRanged: generateRanged,
        generateEquipment: generateEquipment,
        generateSuper: generateSuper
    });

    function rollResults(roll){
        let table = {
            generateFood: 20,
            generateAmmo: 40,
            generateMedicine: 60,
            generateMelee: 75,
            generateRanged: 90,
            generateEquipment: 99,
            generateSuper: 100
        };

        roll = Math.max(roll, 100);
        let key;


        for (let t in table){
            if (table[t] > roll){
                break;
            }
            key = t;
        }

        
        return generator[key](roll);
    }


    function rollTable(){
        sendChat('', `/roll 1d100`, function(ops) {
            // ops will be an ARRAY of command results.
            var rollresult = ops[0];
            var result = JSON.parse(rollresult.content);

            log(result.total);

            log(rollResults(result));
        });
    }

    var Main = Main || (function(){
        const original = [1, 2, 3, 4, 5];
        var cards = [...original];

        const HandleInput = function(msg) {

            if (msg.content.startsWith("!!roll")){

                randomInteger();
                cards.pop();

                log(cards);
            }

            if (msg.content.startsWith("!!shuffle")){
                cards = [...original];

                log(cards);
            }

            if (msg.content.startsWith("!!draw")){
                rollTable();
            }
        };
        
        

        
        
        const RegisterEventHandlers = function() {
    		on('chat:message', HandleInput);
    	};

        return {
            RegisterEventHandlers: RegisterEventHandlers
        }
    })();



    on("ready", function(){
        Main.RegisterEventHandlers();
    });

})();
