import { CharacterActor } from "../actors/CharacterActor";
import { getRepeaterIds, setupScriptVars } from "../lib/roll20lib";
import { outputDefaultTemplate } from "../lib/roll20lib";
import { meleeWeapons, miscItems } from '../data/itemtemplates';
import { ItemTemplate } from "../actors/ItemTemplate";
import { ItemModel } from "../data/item";


const templates = {
    ...meleeWeapons,
    ...miscItems
};

for (let key in templates){
    //setup new item template class which handles rarity and storing item stats.
    templates[key] = new ItemTemplate(templates[key]);
}


export function HandlePickup(msg){
    if (msg.type !== "api" || !msg.content.startsWith('!!pickup')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg),
        charActor = new CharacterActor(character.id);

    let item = {};

    log("Executing pickup with following args:");
    log(args);
    //if pulling from template, we can pull a variation.
    let rarity = ("rarity" in args) ? args.rarity : '';
    
    //pull fields from template if a template is specified with item key or as a pure arg
    if ("item" in args || "1" in args){

        let itemKey = ("item" in args) ? args['item'] : args['1'];

        if (itemKey in templates){
            item = templates[itemKey].getItem(rarity);
        }
    }

    //add any new props to the item
    for (let key in args){
        //only allow itemmodel fields when building the item
        if (key in ItemModel){
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
