import {fields as character} from '../model/character';
import {fields as card} from '../model/card';
import { getButtonRowId } from './_helpers';

export function equip(){
    const itemFields = {...card};
    delete itemFields.actions; //remove action key

    //This gets all available equipment/weapon slots.
    const slotFields = (function(){
        let result = [
            character.slots.equipmentslots.id,
            character.slots.weaponslots.id
        ];

        for (let i = 1; i <= character.slots.equipmentslots.max; i++){
            result.push(character.slots.equipmentslots.prefix + '_' + i);
        }

        for (let i = 1; i <= character.slots.weaponslots.max; i++){
            result.push(character.slots.weaponslots.prefix + '_' + i);
        }

        return result;
    })();

    //Finds the next available slot for a given type. Pass it values so it can parse through the values - values should contain the retrieved values for all available slots.
    const findAvailableSlot = function(type, values){
        let max = (type == character.slots.weaponslots.prefix) ? values[character.slots.weaponslots.id] : values[character.slots.equipmentslots.id];

        for (let i = 1; i <= max; i++){
            if (values[type + '_' + i] == 0){
                return i;
            }
        }

        return null;
    };

    //get appropriate ID for an attribute in a slot.
    const getSlotId = function(type, attrId, slot){
        return `${type}_${attrId}_${slot}`
    }

    // Create an array of appropriate field Ids.
    // Give it a prefix to just append a simple prefix to the Id as in the case of repeating inventory
    // Give it a type and slot to call getSlotId as in the case of slots.
    const createFieldIdArray = function(prefix, type, slot){
        let result = [];

        for (let key in itemFields){
            let fld = itemFields[key];
            let name;
            if (prefix.length){
                name = prefix + '_' + fld.id;
            } else if (type && slot){
                name = getSlotId(type, fld.id, slot);
            } else {
                name = fld.id;
            }
            result.push(name);

            if ('max' in fld && fld.max == true){
                result.push(name + '_max');
            }
        }
        return result;
    }


    const unequipItem = function(type, slot){
        let unequipFields = createFieldIdArray('', type, slot);
        
        getAttrs(unequipFields, function(values){
            const rowId = generateRowID();
            var attrSet = {};

            for (const key in itemFields){
                const fld = itemFields[key]; //the original field
                
                //unequiping is basically swapping objects
                const unequipkey = getSlotId(type, fld.id, slot);
                const invkey = `repeating_inventory_${rowId}_${fld.id}`;

                attrSet[invkey] = values[unequipkey];

                if ('max' in fld && fld.max == true){
                    attrSet[invkey + '_max'] = values[unequipkey + '_max'];
                }


                //clear out equipped fields
                if ('default' in fld){
                    attrSet[unequipkey] = fld.default;
                } else {
                    attrSet[unequipkey] = '';

                    if ('max' in fld && fld.max == true){
                        attrSet[unequipkey + '_max'] = '';
                    }
                }
            }

            attrSet[type + '_' + slot] = 0; //make the slot available again.
            setAttrs(attrSet);
        });
    }


    const equipItem = function(rowId){
        // Get both slots and inventory fields
        const invFields = createFieldIdArray('repeating_inventory');

        const bothFields = invFields.concat(slotFields);

        getAttrs(bothFields, function(values){
            //retrieve given card type.
            let type = values[`repeating_inventory_${card.type.id}`];
            if (type == character.inventory.prefix){ return;} //only equip weapons and equipment
            
            let slot = findAvailableSlot(type, values); //now find an available slot for its type.

            //Slot is available!
            if (slot){
                var attrSet = {};

                //Loop to transpose repeating inventory field to the appropriate slot
                //basically swapping objects
                for (const key in itemFields) {
                    const fld = itemFields[key];
                    const invkey = `repeating_inventory_${fld.id}`;
                    const equipkey = getSlotId(type, fld.id, slot);

                    if (invkey in values && typeof values[invkey] != 'undefined'){
                        attrSet[equipkey] = values[invkey];
                        
                        // don't forget max
                        if ('max' in fld && fld.max == true){
                            attrSet[equipkey + '_max'] = values[invkey + '_max'];
                        }
                    } else {
                        attrSet[equipkey] = ''; //default value
                    }
                }

                attrSet[type + '_' + slot] = 'on';
                removeRepeatingRow(rowId); //remove current row
                setAttrs(attrSet);
            }
        });
    }


    // Hooks for buttons
    on(`clicked:repeating_inventory:${card.actions.equip}`, function(evInfo){
        const rowId = getButtonRowId(evInfo);
        equipItem(rowId);
    });

    on(`clicked:repeating_inventory:${card.actions.delete}`, function(evInfo){
        const rowId = getButtonRowId(evInfo);
        removeRepeatingRow(rowId);
    });


    for (let i = 1; i <= character.slots.weaponslots.max; i++){
        on(`clicked:${character.slots.weaponslots.prefix}_${card.actions.unequip}_${i}`, function(){
            unequipItem(character.slots.weaponslots.prefix, i);
        });
    }

    for (let i = 1; i <= character.slots.equipmentslots.max; i++){
        on(`clicked:${character.slots.equipmentslots.prefix}_${card.actions.unequip}_${i}`, function(){
            unequipItem(character.slots.equipmentslots.prefix, i);
        });
    }
}