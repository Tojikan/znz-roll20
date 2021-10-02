
import * as generator from './itemgenerator';

function rollResults(roll){
    let result = {};
    let table = {
        generateFood: 20,
        generateAmmo: 40,
        generateMedicine: 60,
        generateMelee: 75,
        generateRanged: 90,
        generateEquipment: 99,
        generateSuper: 100
    }

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

export default rollTable;