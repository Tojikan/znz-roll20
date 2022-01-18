import { CharacterModel } from "../../data/character";
import { ItemTypes } from "../../data/item";
import { objToArray } from "../../lib/znzlib";

/**
 * Dynamic CSS Generated through loops and such whilst in the Component does not seem to work well with Linaria.
 * However, generating the styles elsewhere and importing it seems to be okay - probably because Linaria can evaluate the variable but not if its in the component.
 * So we generate it here and just import and drop it in.
 */



/**
 * Returns the CSS for showing Slots based on what equipmentslots is set to.
 * 
 * Equipmentslots is a number input field that will have checkboxes for each possible value. Checkboxes will trigger the slots.
 */
export const SlotTriggerCSS = (function(){
    let result = '';
    for (let i = 1; i <= CharacterModel.equipmentslots.count; i++){
        // If slot trigger i is checked...
        result += `.slot-trigger-${i}:checked{  `;

        // show all slots i and under
        for (let j = i; j > 0; j--) {
            result += ` ~ .slot_${j} {
                display: block;
            }`
        }

        result += '}'
    }

    return result;
})();



/**
 * Used in Item Cards to dynamically generate CSS for showing/hiding fields based on thee item type.
 */
 export const ItemTypesFieldCSS = (function(){
    let result = '';

    for (let type of objToArray(ItemTypes)){
        result += ` .item-type-${type.key}:checked{
            ~ .card-content {
                .${type.key}-type-field{
                    display: block;
                }
            }
        } `
    }

    return result;
})();
