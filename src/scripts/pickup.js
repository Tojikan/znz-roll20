import { fields as card } from '../model/card';
import { fields as charFields } from '../model/character';
import * as itemtemplates from '../model/items.json';
import { generateRowID, getAttrVal, getRepeaterIds } from "./_helpers";

const templates = itemtemplates;
const acceptedFields = (()=>{ //get acceptable params - the key of the field in card. Note we use the field key NOT the field ID!
    let result = [];
    for (let key in card){
        if (key == 'actions') continue; //ignore actions

        result.push(key);

        if ('max' in card[key] && card[key].max == true) result.push(key + '_max'); //add max fields 
    }
    return result;
})();


export function handlePickup(character, args){
    
    let item = {};

    // pull from existing template
    if ("item" in args && args.item in templates){
        item = templates[args.item];
    }

    //add any new props
    for (let key in args){
        if (acceptedFields.includes(key)){
            item[key] = args[key];
        }
    }



    if (Object.keys(item).length){

        let inventorySlots = getAttrVal(character, charFields.inventory.id);
        let inventoryIds = getRepeaterIds(charFields.inventory.id, character.id);

        if (inventoryIds.length >= inventorySlots){
            return {msg: "Error: Character has no more available inventory slots!", type: "error"};
        }

        createInventoryItem(character, item);
        return {msg: `${character.get('name')} picked up a(n) ${item["name"] || 'Item'}`, type:"success"};
    } else {
        return {msg: "Error: Invalid item or no arguments provided.", type: "error"}
    }
}


function createInventoryItem(character, item){
    var rowId = generateRowID();

    for (let key in item){

        //Don't handle max fields - max needs to be set as a property of an attribute
        if (key.endsWith('_max')){
            continue;
        }

        let fld = card[key]; //get original field
        let attr = {};

        attr.name = `repeating_${charFields.inventory.id}_${rowId}_${fld.id}`;
        attr.current = item[key];
        attr.characterid = character.id;

        if ('max' in fld && fld.max == true){
            attr.max = item[key];

            if (item.hasOwnProperty(key + '_max')){
                attr.max = item[key + '_max'] || '';
            } else {
                attr.max = attr.current;
            }
        }

        createObj("attribute", attr);
    }
}