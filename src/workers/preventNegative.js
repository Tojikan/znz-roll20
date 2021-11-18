import {fields as character} from '../model/character';


export function preventNegative(){
    on(`change:${character.stats.fatigue.id}`, function(){

        getAttrs([character.stats.fatigue.id], function(values){
            let fatigue = parseInt(values[character.stats.fatigue.id], 10);


            if (isNaN(fatigue)){
                console.error('Error when parsing slots');
                return;
            }

            if (fatigue < 0) {
                const attrSet = {
                    [character.stats.fatigue.id]: 0
                }

                setAttrs(attrSet);
            }
        });
    });
}