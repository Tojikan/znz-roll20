import { outputDefaultTemplate, setupScriptVars } from "../lib/roll20lib";
import { generateParamString } from "../lib/znzlib";
import { CharacterActor } from "../actors/CharacterActor";
import { ItemActor } from "../actors/ItemActor";



// Define how we set up our roll buttom command here - gets dropped in the template
// Then we know what params will be passed to the api function.
export function GenerateReloadCommand(index, itemFields){
    //send the indexed key so we can query on it as we will need the full attr object for setting anyway.
    let params = {
        item: index,
        characterid: '@{character_id}',
        type: `@{${itemFields.ammotype.key}}`,
        weaponname: `@{${itemFields.name.key}}`,
    }

    return '!!reload ' + generateParamString(params);
}



export function HandleReload(msg) {
    if (msg.type !== "api" || !msg.content.startsWith('!!reload')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg);
    
    const charActor = new CharacterActor(character.id),
        itemActor = new ItemActor( character.id, args.item),
        resultTitle = `${character.get('name')} attempts to reload their ${args.weaponname}!`,
        result = [];

    //to reduce requests to r20 api, we just get the attr and compute from there rather than use the proxy setter.
    const ammoAttr = itemActor.attrs.ammo,
        ammoStoreAttr = charActor.attrs[args.type];

    const ammo = parseInt(ammoAttr.get('current'), 10) || 0,
        ammoMax = parseInt(ammoAttr.get('max'), 10) || 0,
        ammoStore = parseInt(ammoStoreAttr.get('current'), 10) || 0;
        
        
    if (ammoStore <= 0){
        result.push({label: 'Failed to Reload', value:`${character.get('name')} has 0 ammo to reload with!`});
        outputDefaultTemplate(result, resultTitle, sender);
        return;
    }
    
    // get diff between max and curr, but limit it to size of store.
    // factors in scenarios if max < curr 
    let ammoToAdd = Math.min( Math.max(ammoMax - ammo, 0), ammoStore)
        
    if (ammoToAdd == 0){
        //already full
        result.push({label: 'Reload Failed!', value: `${args.weaponname} is already full on ammo!`})
        outputDefaultTemplate(result, resultTitle, sender);
        return;
    } else {
        ammoAttr.setWithWorker({current: ammo + ammoToAdd});
        ammoStoreAttr.setWithWorker({current: ammoStore - ammoToAdd});
        result.push({label: 'Success', value:`${character.get('name')} reloads!`});
    }
    
    
    outputDefaultTemplate(result, resultTitle, sender);
}
