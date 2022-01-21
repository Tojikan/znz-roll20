import { Actor } from "./Actor";
import { CharacterModel } from "../data/character";
import { generatePoolRollText } from "../lib/roll20lib";



const fields = {
    ...CharacterModel.attributes,
    ...CharacterModel.combatskills,
    ...CharacterModel.resources,
    ...CharacterModel.ammo.list,
    ...CharacterModel.bonusrolls,
    ...CharacterModel.rollcost,
    ...CharacterModel.rolltype,
};


export class CharacterActor extends Actor {
    constructor(characterId){
        super(characterId, fields);
    }


    roll(attr, bonus){
        let fatiguePenalty = this.data.fatigue / 10,
            energy = this.data.energy,
            bonusDice = this.data.bonusrolls;

        let totalPool = Math.max(energy + bonusDice + bonus - fatiguePenalty);

        return generatePoolRollText(totalPool, attr);
    }
}
