
import {fields as charFields} from '../model/character';
import { sequenceNumber } from './_helpers';


//If a Stat is rollable, set a _rolls field to be a sequence of numbers
//ie if stat is 5, set _rolls field to be 1|2|3|4|5
//That way, we can use dropdowns for roll buttons based on the stats value
export function rollOptions(){
    for (let stat in charFields.stats){
        let curStat = charFields.stats[stat];

        if (curStat.rollable){
            let attr = curStat.id;
    
            on( 'change:' + attr, function(){
                getAttrs([attr], function(values){
                    let numOfDice = parseInt(values[attr], 10);

                    var attrSet = {
                        [attr + '_rolls'] : sequenceNumber(numOfDice, '|', true) //start at value
                    }

                    // Add bonus options
                    for (let i = 1; i <= numOfDice; i++){
                        attrSet[attr + '_rolls'] += `| ${numOfDice }( + ${i} bonus rolls ), ${numOfDice}b${i}`;
                    }

                    setAttrs(attrSet);
                });
            })
        }
    }

}