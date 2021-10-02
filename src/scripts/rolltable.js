
import * as generator from './itemgenerator';

export function rollTable(roll){
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