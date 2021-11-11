import { fields as character } from '../model/character';
import { fields as card } from '../model/card';
import { options } from '../model/card';
import { getButtonRowId } from './_helpers';

/**
 * IDs
 * - equipmentslots (slotsId): stores the current number of slots.
 * - equipment_{x}: whether slot is active or not
 */

export function equip(itemCardFields = card){
    //pull data into variables for easier interchangeability
    let itemFields = {...itemCardFields},
        slotsId = character.equipmentslots.id,
        equipId = character.equipmentslots.type,
        maxSlots = character.equipmentslots.max,
        inventoryId = character.inventory.id,
        equipPrefix = character.equipmentslots.type,
        unequipAction = options.actions.unequip,
        equipAction = options.actions.equip;

    

    /**
     * Gets all available item slot IDs
     */
    const getSlotFields = function(){
        let result = [];

        // 1 - indexed
        for (let i = 1; i <= maxSlots; i++){
            result.push(equipId + '_' + i);
        }
        return result;
    };

    /**
     * Gets an array of all item field Ids.
     * 
     * @param {*} suffix - if present, adds it to the end of the field with preceeding underscore.
     * @returns array of Id strings.
     */
    const getItemFieldIds = function(suffix, prefix, fields=itemFields){
        let result = [];
        
        const affix = function(str){
            let result = str;

            if (suffix && suffix.toString().length){
                result = result + '_' + suffix;
            }

            if (prefix && prefix.length){
                result = prefix + '_' + result;
            }

            return result;
        };

        for (const key in fields){
            let fld = fields[key],
                id = affix(fld.id);

            result.push(id);

            if ('max' in fld && fld.max.length){
                result.push(affix(fld.max));
            }
        }

        return result;
    }

    /**
     * Generates a setAttrs object for an empty equipment object
     * 
     * @param {*} fields - in case you need custom fields for testing or something.
     */
    const generateBlankEquipmentObj = function(id, fields=itemFields){

        let result = {};
        
        for (const key in fields){
            const fld = fields[key],
                newKey = equipPrefix + '_' + key + '_' + id;


            if ('default' in fld){
                result[newKey] = fld.default;
            } else {
                result[newKey] = '';

                if ('max' in fld){
                    result[fld.max + '_' + id] = '';
                }
            }
        }
        return result;
    }

    /**
     * Remaps the values of an object to a modified version of its original key
     * 
     * @param {obj} obj - object to remap keys with text affixed to it
     * @param {text} affix - text to add to front or back when transposing
     * @param {bool} pre - add to front of key when transposing. Set false to add to back.
     * @param {fn} keyfn - callback function to allow additional modifications on the key. Is passed the key and it should return a string.
     */
    const remapKeys = function(obj, affix, pre=true, keyfn){
        const result = {};

        for (const key in obj){
            let keyText = key;

            if (keyfn){
                keyText = keyfn(keyText);
            }

            const newKey = (pre ? `${affix}${keyText}` : `${keyText}${affix}`);
            result[newKey] = obj[key];
        }

        return result;
    }

    /**
     * Find next available slot.
     * 
     * @param {*} values values retrieved from getAttrs. Should contain all equipmentslots.
     * @returns the Index number of the slot
     */
    const findNextAvailableSlotIndex = function(values){
        if (slotsId in values){
            //only check up to the character's currently number of slots
            let max = values[slotsId];
    
            //Find next open slot and return.
            for (let i = 1; i <= max; i++){
                if (values[equipId + '_' + i] == 0){
                    return i;
                }
            }
        }

        return null;
    };

    /**
     * Unequip a given slot.
     * 
     * @param {*} slotIndex - Which slot to unequip
     */
    const unequipItem = function(slotIndex){
        //Get array of fields
        let unequipFields = getItemFieldIds(slotIndex, equipPrefix);
        
        getAttrs(unequipFields, function(values){
            const rowId = generateRowID(); 

            //create new inv item to create
            const newInvItem = remapKeys(values,  `repeating_${inventoryId}_${rowId}_`, true, function(x){ 
                let result = x.replace('equipment_', '');
                let last = result.lastIndexOf(`_${slotIndex}`); //lastIndex so we make sure to only get the end
                
                if (last > 0){
                    return result.substring(0, last);
                } else {
                    return result;
                }
            });
            
            //clear equipment fields
            const emptyEquipment = generateBlankEquipmentObj(slotIndex);

            const attrSet = {
                ...newInvItem,
                ...emptyEquipment
            };

            //make the slot available again.
            attrSet[`${equipId}_${slotIndex}`] = 0;
            console.log(attrSet);
            setAttrs(attrSet);
        });
    }


    const equipItem = function(rowId){
        // Get fields for both equipment and inventory and the id for equipment slots
        const bothFields = getItemFieldIds('', `repeating_${inventoryId}`)
                .concat(getSlotFields());
            bothFields.push(slotsId);

        getAttrs(bothFields, function(values){
            // find availble slot
            let availableSlotIndex = findNextAvailableSlotIndex(values);

            //Slot is available!
            if (availableSlotIndex){
                
                //only consider inventory fields for remapping
                let inventoryFields = Object.keys(values)
                    .filter(x => x.includes(`repeating_${inventoryId}`))
                    .reduce((obj, key) => {
                        obj[key] = values[key];
                        return obj;
                    }, {});

            
                
                //filter add index, filter out repeating_inventory
                let newEquipment = remapKeys(inventoryFields, `_${availableSlotIndex}`, false, (x) => { return x.replace(`repeating_${inventoryId}_`, `${equipPrefix}_`);});
                
                const attrSet = {
                    ...newEquipment
                };

                // set slot to active
                attrSet[equipId + '_' + availableSlotIndex] = 'on';

                removeRepeatingRow(rowId); //remove current row
                console.log(attrSet);
                setAttrs(attrSet);
            } else {
                console.log('No slot found!');
            }
        });
    }

    const init = function(){
        // Hooks for buttons
        on(`clicked:repeating_${inventoryId}:${equipAction}`, function(evInfo){
            const rowId = getButtonRowId(evInfo);
            equipItem(rowId);
        });
    
        for (let i = 1; i <= maxSlots; i++){
            on(`clicked:${equipId}_${unequipAction}_${i}`, function(){
                unequipItem(i);
            });
        }
    }

    return {
        init: init,
        getItemFieldIds: getItemFieldIds,
        generateBlankEquipmentObj: generateBlankEquipmentObj,
        remapKeys:  remapKeys,
        findNextAvailableSlotIndex: findNextAvailableSlotIndex,
        getSlotFields: getSlotFields
    }
}