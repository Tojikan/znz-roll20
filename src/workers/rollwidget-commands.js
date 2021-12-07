// import { fields as character } from "../model/character";
import { CharacterModel } from "../models/characterModel";




export function rollwidget(){
    const charModel = Character.toJson();
    const AP = charModel.actions;

    // AP reset
    //reset to max
    on(`clicked:${AP.action}`, function(evInfo){
        console.log('hello');
        getAttrs([AP.id, AP.id + '_max'], function(results){
            setAttrs({
                [AP.id]: results[AP.id + '_max']
            });
        });
    });

    // fatigue reset
    // reset to 0
    // on(`clicked:${character.actions.resetfatigue.id}`, function(evInfo){
    //     setAttrs({
    //         [character.stats.fatigue.id]: 0
    //     });
    // });


    // Move
    // subtract 1
    // on(`clicked:${character.actions.move.id}`, function(evInfo){
    //     getAttrs([character.stats.ap.id, character.stats.fatigue.id], function(results){
    //         setAttrs({
    //             [character.stats.ap.id]: Math.max(parseInt(results[character.stats.ap.id], 10) - 1, 0),
    //             [character.stats.fatigue.id]: Math.max(parseInt(results[character.stats.fatigue.id], 10) + 3, 0)
    //         });
    //     });
    // });

}



