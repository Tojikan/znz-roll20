import { getAttrVal } from "./_helpers";
import { fields } from '../model/card';
import * as templates from '../model/items.json';

const invPrefix = "(([[data.character.slots.inventoryslots.prefix]]))";
const templates = (([[data.items]]));
const acceptedFields = Object.keys(fields).filter(x => x != 'actions');

export function pickup(char, args){
    
    let slot = findOpenInventorySlot(char);
    let item = {};

    if ("item" in args && args.item in templates){
        item = templates[args.item];
    }

    for (let key in args){
        if (acceptedFields.includes(key)){
            item[key] = args[key];
        }
    }


    for (let key in item){
        

    }

    


}


function findOpenInventorySlot(char){
    const maxSlots = (([[data.character.slots.inventoryslots.max]]));
    for (let i = 1; i <= maxSlots; i++){
        let attr = getAttrVal(char, invPrefix + "_" + i);

        if (!attr){ //If undefined - means it hasn't been used yet so it's open
            return i;
        }

        if (attr.get('current') === 0){ //0 means off - unchecked
            return i
        }
    }

    return null;
}
