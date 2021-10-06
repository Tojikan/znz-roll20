import {fields as character} from '../model/character';
import {fields as card} from '../model/card';
import { getButtonRowId } from './_helpers';

export function equip(){
    const itemFields = {...card};
    delete itemFields.actions; //remove action key
    
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


    const findAvailableSlot = function(type, values){
        let max = (type == character.slots.weaponslots.prefix) ? values[character.slots.weaponslots.id] : values[character.slots.equipmentslots.id];

        for (let i = 1; i <= max; i++){
            if (values[type + '_' + i] == 0){
                return i;
            }
        }

        return null;
    };

    const unequipItem = function(type, id){
        let unequipFields = [];
        for(let key in itemFields){
            let name = `${type}_${itemFields[key].id}_${id}`;

            unequipFields.push(name);

            if ('max' in itemFields[key] && itemFields[key].max == true){
                unequipFields.push(name + '_max');
            }
        }
        
        getAttrs(unequipFields, function(values){
            console.log(values);

            for (const key in itemFields){
                const fld = itemFields[key];
            }
        });
    }


    const equipItem = function(rowId){
        const invFields = Object.keys(itemFields).map((x)=> {return `repeating_inventory_${itemFields[x].id}`});
        const bothFields = invFields.concat(slotFields);


        getAttrs(bothFields, function(values){
            let type = values[`repeating_inventory_${card.type.id}`];
            if (type == character.inventory.prefix){ return;}
            
            let slot = findAvailableSlot(type, values);

            if (slot){
                var attrSet = {};

                for (const key in itemFields) {
                    const fld = itemFields[key];
                    const invkey = `repeating_inventory_${fld.id}`;
                    const equipkey = `${type}_${fld.id}_${slot}`;

                    if (invkey in values && typeof values[invkey] != 'undefined'){
                        attrSet[equipkey] = values[invkey];

                        if ('max' in fld && fld.max == true){
                            attrSet[equipkey + '_max'] = values[invkey + '_max'];
                        }
                    } else {
                        attrSet[equipkey] = '';
                    }
                }

                attrSet[type + '_' + slot] = 'on';
                removeRepeatingRow(rowId); //remove current
                setAttrs(attrSet);
            }
        });
    }

    on(`clicked:repeating_inventory:${card.actions.equip}`, function(evInfo){
        const rowId = getButtonRowId(evInfo);
        equipItem(rowId);
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