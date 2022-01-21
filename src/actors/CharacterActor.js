import { Actor } from "./Actor";
import { CharacterModel } from "../data/character";
import { generatePoolRollText } from "../lib/roll20lib";



// Permitted fields - you should just add fields that will be used in the API.
const fields = {
    ...CharacterModel.attributes,
    ...CharacterModel.combatskills,
    ...CharacterModel.resources,
    ...CharacterModel.ammo.list,
    bonusrolls: CharacterModel.bonusrolls,
    rollcost: CharacterModel.rollcost,
    rolltype: CharacterModel.rolltype,
};

// Remember that get() in this.data and this.attrs calls the Roll20 API so try to cache into a variable if you can.

/**
 * Actor Object for interfacing with Character Attributes in an API Script.
 * Pass it a characterId and you should be able to access allowed attributes through this.data or this.attrs
 */
export class CharacterActor extends Actor {
    constructor(characterId){
        super(characterId, fields);
    }

    /**
     * Does a pool roll against a target.
     * @param {*} target Target for roll
     * @param {*} bonus Add bonus to target.
     * @returns 
     */
    roll(target, bonus){
        let fatiguePenalty = parseInt(this.data.fatigue / 10, 10),
            energy = parseInt(this.data.energy, 10),
            bonusDice = parseInt(this.data.bonusrolls, 10);

        let totalPool = Math.max(energy + bonusDice + parseInt(bonus, 10) - fatiguePenalty);
        let rollTarget = target + parseInt(bonus, 10);

        return generatePoolRollText(totalPool, rollTarget);
    }

    /**
     * Adds fatigue equal to rollcost.
     * @returns false if free roll cost, else returns roll cost
     */
    addFatigue(){
        if (this.data.rolltype == 'free') {
            return false;
        }

        let fatAttr = this.attrs.fatigue;
        let rollCost = this.data.rollcost;
        let currFat = parseInt(fatAttr.get('current'), 10) || 0;
        let newFat = Math.max(currFat + rollCost, 0);

        fatAttr.setWithWorker({current: newFat});

        return rollCost;
    }
}
