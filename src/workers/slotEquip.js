import { CharacterModel } from "../data/character";
import { getButtonRowId } from "../lib/roll20lib";
import { affixStr } from "../lib/znzlib";




// An Indexed Field refers to a field that is specific to a particular slot or repeater row.
// i.e. the 'name' field in equipment slot 1 is '1_name' 

class ItemField {
    constructor(fld, key=null){
        this.key = (key ? key : fld.key);
        this.field = fld;
        this.hasMax = 'max' in fld && fld.max;
    }

    /**
     * Get an attr of a field
     * @param {*} ind - apply an index to the field.
     * @returns attribute of field
     */
    getAttr(ind = null){
        return (ind ? affixStr(ind, this.key, null) : this.key);
    }

    getMaxAttr(ind){
        return this.getAttr(ind) + '_max';
    }

    getDefaultValue(){
        return ('default' in this.field) ? this.field.default : '';
    }
    
    /**
     * Resets an equipment slot attr to a base item attr.
     * 
     * @param {str} attr 
     */
    static resetEquipmentAttr(attr){
        //regex to strip numbers at the start and any proceeding underscores
        return attr.replace(/^[0-9]+_/, '');
    }
}

class SlotManager{
    constructor(slotKey, slotMax, equipSlots){
        this.slotKey = slotKey;
        this.slotMax = slotMax;
        this.slotsCountKey = equipSlots;
    }

    getSlotAttr(ind){ return this.slotKey + '_' + ind }

    getMaxSlots(){ return this.slotMax;}

    /**
     * @returns array of all Slot attrs
     */
    getAllSlotAttrs(){
        let result = [];

        // 1 - indexed
        for (let i = 1; i <= this.slotMax; i++){
            result.push(`${this.slotKey}_${i}`);
        }
        return result;
    }

    /**
     * Find next available slot given values retrieved from getAttrs
     * 
     * @param {*} values should contain all equipment slots
     * @returns the Index number of the slot
     */
    findNextAvailableSlot(values){
        if (this.slotsCountKey in values){
            //only check up to the character's current number of slots
            let max = values[this.slotsCountKey];
    
            //Find next open slot and return.
            for (let i = 1; i <= max; i++){
                if (values[this.getSlotAttr(i)] == "0"){
                    return i;
                }
            }
        }

        return null;
    }

    /**
     * Returns the object needed to set a slot to be available.
     * @param {*} ind 
     */
    resetSlot(ind){
        return {[`${this.slotKey}_${ind}`]: 0};
    }

    /**
     * Returns the objected needed to set a slot to be used.
     * @param {*} ind 
     */
    setSlot(ind){
        return {[`${this.slotKey}_${ind}`]: 'on'};
    }
}


export function slotEquip(itemCardFields){
    //pull data into variables for easier interchangeability
    const itemFields = {...itemCardFields},
        slotKey = CharacterModel.equipmentslots.slotkey,        //attr for individual slots
        maxSlots = CharacterModel.equipmentslots.max,           //max number of slots
        slotsCountKey = CharacterModel.equipmentslots.key,         //attr for number of slots.
        inventoryId = CharacterModel.inventory.key,             //attr for inventory
        unequipAction = 'unequip',
        equipAction = 'equip';



    const slotManager = new SlotManager(slotKey, maxSlots, slotsCountKey);

    /**
     * Gets an array of all item field attrs. If necessary, this will return an indexed field ID.
     * 
     * @param {*} ind - apply an index to this field.
     * @returns array of attr strings.
     */
    const getAllItemFieldAttrs = function(ind=null, fields=itemFields){
        let result = [];
        
        for (const key in fields){
            let fld = new ItemField(fields[key]);
            result.push(fld.getAttr(ind));

            if (fld.hasMax){
                result.push(fld.getMaxAttr(ind));
            }
        }

        console.log(result);
        return result;
    }

    /**
     * Generates a object that will result in a blank item if added via Roll20 API.
     * @param {*} ind index this field. if supplied, should generate an empty equipment slot.
     * @param {*} fields - fields to generate an object from.
     */
    const generateBlankItemAttrSet = function(ind, fields=itemFields){

        let result = {};
        
        for (const key in fields){
            let fld = new ItemField(fields[key]);
            let newKey = fld.getAttr(ind);

            result[newKey] = fld.getDefaultValue();

            if (fld.hasMax){
                let maxKey = fld.getMaxAttr(ind);
                result[maxKey] = fld.getDefaultValue();
            }
        }
        return result;
    }

    /**
     * Takes a Roll20 GetAttrs object and then applies changes to all of its keys, allowing you to map existing values
     * to a new attribute. You can apply a callback function to the key or just 
     * 
     * @param {*} values results from getAttrs
     * @param {*} ind optional index to apply to the field
     * @param {*} callbackFn 
     * @returns 
     */
    const mapValues = function(values, ind=null, callbackFn){
        const result = {};

        for (let key in values){
            let currKey = key;

            if (callbackFn){
                currKey = callbackFn(currKey);
            }
            
            let fld = new ItemField({}, currKey);
            let newKey = fld.getAttr(ind); //apply index to field
            
            
            result[newKey] = values[key];
        }

        return result;
    }


    /**
     * Unequip a given slot
     * 
     * @param {*} slotIndex - Which slot to unequip
     */
    const unequipItem = function(slotIndex){
        //Get array of fields
        let unequipFields = getAllItemFieldAttrs(slotIndex);
        
        getAttrs(unequipFields, function(values){
            const rowId = generateRowID(); 

            //Map the equipment field values to a blank inventory item.
            const newInventoryItem = mapValues(values,`repeating_${inventoryId}_${rowId}`, function(x){
                console.log(ItemField.resetEquipmentAttr(x));
                return ItemField.resetEquipmentAttr(x);
            });

            //Create an object to set the equipment field to empty.            
            const emptyEquipment = generateBlankItemAttrSet(slotIndex);

            //make the slot available again.
            const resetSlot = slotManager.resetSlot(slotIndex);

            const attrSet = {
                ...newInventoryItem,
                ...emptyEquipment,
                ...resetSlot,
            };

            console.log(attrSet);
            setAttrs(attrSet);
        });
    }

    /**
     * Equips an inventory item to next available slot.
     * @param {*} rowId 
     */
    const equipItem = function(rowId){
        // Get fields for both equipment and inventory and the id for equipment slots
        const bothFields = getAllItemFieldAttrs(`repeating_${inventoryId}`).concat(slotManager.getAllSlotAttrs());

        bothFields.push(slotsCountKey); //keep track of how many slots available so we limit how much we search. for an open slot.

        getAttrs(bothFields, function(values){
            console.log(values);
            let availableSlotIndex = slotManager.findNextAvailableSlot(values);

            //Slot is available!
            if (availableSlotIndex){
                
                //we can filter out non inventory fields now that we find our slot.
                //then we run reduce so its back into an object!
                let inventoryFields = Object.keys(values)
                    .filter(x => x.includes(`repeating_${inventoryId}`))
                    .reduce((obj, key) => {
                        obj[key] = values[key];
                        return obj;
                    }, {});

            
                //now we generate the fields for our new equipment and remove the inventory stuff.
                let newEquipment = mapValues(inventoryFields, availableSlotIndex, (x)=>{
                    return x.replace(`repeating_${inventoryId}_`, '');
                });

                let setSlotActive = slotManager.setSlot(availableSlotIndex);
                

                const attrSet = {
                    ...newEquipment,
                    ...setSlotActive,
                };

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
            console.log('equip!');
            const rowId = getButtonRowId(evInfo);
            equipItem(rowId);
        });
    
        for (let i = 1; i <= maxSlots; i++){
            on(`clicked:${unequipAction}_${i}`, function(){
                console.log('unequip');
                unequipItem(i);
            });
        }
    }


    init();
}