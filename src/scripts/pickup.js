import { CharacterActor } from "../actors/CharacterActor";
import { getRepeaterIds, setupScriptVars } from "../lib/roll20lib";
import { outputDefaultTemplate } from "../lib/roll20lib";


//TODO templates
const templates = {};

export function HandlePickup(msg){
    if (msg.type !== "api" || !msg.content.startsWith('!!pickup')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg),
        charActor = new CharacterActor(character.id);

    let item = {};

    if ("item" in args && args.item in templates){
        item = templates[args.item];
    }

    //add any new props
    for (let key in args){
        //ITEM IS A RESERVED ARG AND SHOULD NOT BE USED AS A ITEMMODEL FIELD.
        if (key !== 'item'){
            item[key] = args[key];
        }
    }

    const result = [],
        itemName = item['name'] || "Item",
        title = `${character.get('name')} tries to pick up a(n) ${itemName}!`;

    
    if (!Object.keys(item).length){
        result.push({label: 'Error!', value: `Empty or Invalid Item!`});
        outputDefaultTemplate(result, title, sender);
        return;
    }
        
    const slots = charActor.data.inventoryslots,
        allIds = getRepeaterIds(charActor.fields.inventory.key, charActor.characterId);

    if (allIds.length >= slots){
        result.push({label: 'Inventory Full!', value: `${character.get('name')} has no more inventory slots!`});
        outputDefaultTemplate(result, title, sender);
        return;
    }      
    
    let pickedUp = charActor.addItem(item); //returns how many valid fields were added.

    if (pickedUp > 0){
        result.push({label:'Success!', value: `${character.get('name')} picked up a(n) ${itemName}`});
        result.push({label:'Valid Fields Added', value: pickedUp});
    } else {
        result.push({label:'Invalid Item!', value: `No fields were added. Did you use correct format?`});
    }

    outputDefaultTemplate(result, title, sender);
}