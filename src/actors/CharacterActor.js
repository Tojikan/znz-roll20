import { Actor } from "./Actor";
import { CharacterModel } from "../data/character";
import { generatePoolRollText, generateRowID } from "../lib/roll20lib";
import { ItemModel } from "../data/item";
import { objToArray } from "../lib/znzlib";



// Permitted fields - you should just add fields that will be used in the API.
const fields = {
    ...CharacterModel.attributes,
    ...CharacterModel.combatskills,
    ...CharacterModel.resources,
    ...CharacterModel.ammo.list,
    bonusrolls: CharacterModel.bonusrolls,
    rollcost: CharacterModel.rollcost,
    rolltype: CharacterModel.rolltype,
    inventoryslots: CharacterModel.inventoryslots,
    inventory: CharacterModel.inventory, //do not try to get this, just need the key in the fields object for pickup
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

    /**
     * Adds item 
     * @param {*} itemObj object where each key is the item field and value is the value to be set.
     */
    addItem(itemObj){
        const rowId = generateRowID();
        const validKeys = objToArray(ItemModel).map(x => x.key);
        let success = 0;

        for (let key in itemObj){
            //Don't handle max fields directly - max needs to be set as a property of an attribute
            if (!validKeys.includes(key) || key.endsWith('_max')){
                continue;
            }

            let baseField = ItemModel[key];

            const newAttr = {};
            newAttr.name = `repeating_${fields.inventory.key}_${rowId}_${baseField.key}`;
            newAttr.current = Number(itemObj[key], 10) || itemObj[key];
            newAttr.characterid = this.characterId;

            if (baseField.max){
                if (itemObj.hasOwnProperty(key + '_max')){
                    newAttr.max = (Number(itemObj[key + '_max'], 10) || itemObj[key + '_max'] ) || newAttr.current;
                } else {
                    newAttr.max = newAttr.current;
                }
            }

            if (newAttr.current){
                createObj("attribute", newAttr);
                success++;
            }
        }

        return success;
    }
}
