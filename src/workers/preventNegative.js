import {fields as character} from '../model/character';


export function preventNegative(){
    const prevent = [
        character.stats.fatigue.id
    ];

    for (const key in character.ammo.options){
        prevent.push(key.id);
    }

    for (const key in character.combatskills.options){
        prevent.push(key.id);
    }

    for (const key in character.skills.options){
        prevent.push(key.id);
    }

    for (let fld of prevent){
        on(`change:${fld}`, function(){
    
            getAttrs([character.stats.fatigue.id], function(values){
                let val = parseInt(values[fld], 10);
    
    
                if (isNaN(val)){
                    console.error('Error when parsing value when preventing negative');
                    return;
                }
    
                if (val < 0) {
                    const attrSet = {
                        [fld]: 0
                    }
    
                    setAttrs(attrSet);
                }
            });
        });
    }
}