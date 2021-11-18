import { fields as character } from "../model/character";


export function rollwidget(){
    // AP reset
    //reset to max
    on(`clicked:${character.actions.resetap.id}`, function(evInfo){
        getAttrs([character.stats.ap.id, character.stats.ap.id + '_max'], function(results){
            setAttrs({
                [character.stats.ap.id]: results[character.stats.ap.id + '_max']
            });
        });
    });

    // fatigue reset
    // reset to 0
    on(`clicked:${character.actions.resetfatigue.id}`, function(evInfo){
        setAttrs({
            [character.stats.fatigue.id]: 0
        });
    });


    // Move
    // subtract 1
    on(`clicked:${character.actions.move.id}`, function(evInfo){
        getAttrs([character.stats.ap.id], function(results){
            setAttrs({
                [character.stats.ap.id]: Math.max(parseInt(results[character.stats.ap.id], 10) - 1, 0)
            });
        });
    });

}



