import { fields as character } from '../model/character';
import { fields as card } from '../model/card';
import { options } from '../model/card';
import { getButtonRowId } from './_helpers';

export function equip(){
    const itemFields = {...card};

    //This gets all available equipment/weapon slots.
    const slotFields = (function(){
        let result = [
            character.equipmentslots.id,
            character.weaponslots.id
        ];

        for (let i = 1; i <= character.equipmentslots.max; i++){
            result.push(character.equipmentslots.type + '_' + i);
        }

        for (let i = 1; i <= character.weaponslots.max; i++){
            result.push(character.weaponslots.type + '_' + i);
        }

        return result;
    })();

    //Finds the next available slot for a given type. Pass it values so it can parse through the values - values should contain the retrieved values for all available slots.
    const findAvailableSlot = function(type, values){
        let max = (type == character.weaponslots.type) ? values[character.weaponslots.id] : values[character.equipmentslots.id];

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
                const invkey = `repeating_${character.inventory.id}_${rowId}_${fld.id}`;

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

            console.log(attrSet);
            setAttrs(attrSet);
        });
    }


    const equipItem = function(rowId){
        // Get both slots and inventory fields
        const invFields = createFieldIdArray('repeating_' + character.inventory.id);

        const bothFields = invFields.concat(slotFields);

        getAttrs(bothFields, function(values){
            //retrieve given card type.
            let type = values[`repeating_inventory_${card.type.id}`];
            if (type == character.inventory.type){ return;} //only equip weapons and equipment
            
            let slot = findAvailableSlot(type, values); //now find an available slot for its type.

            //Slot is available!
            if (slot){
                var attrSet = {};

                //Loop to transpose repeating inventory field to the appropriate slot
                //basically swapping objects
                for (const key in itemFields) {
                    const fld = itemFields[key];
                    const invkey = `repeating_${character.inventory.id}_${fld.id}`;
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
    on(`clicked:repeating_${character.inventory.id}:${options.actions.equip}`, function(evInfo){
        const rowId = getButtonRowId(evInfo);
        equipItem(rowId);
    });


    for (let i = 1; i <= character.weaponslots.max; i++){
        on(`clicked:${character.weaponslots.type}_${options.actions.unequip}_${i}`, function(){
            unequipItem(character.weaponslots.type, i);
        });
    }

    for (let i = 1; i <= character.equipmentslots.max; i++){
        on(`clicked:${character.equipmentslots.type}_${options.actions.unequip}_${i}`, function(){
            unequipItem(character.equipmentslots.type, i);
        });
    }
}