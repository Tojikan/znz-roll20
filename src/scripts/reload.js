import { outputDefaultTemplate, setupScriptVars } from "../lib/roll20lib";
import { generateParamString } from "../lib/znzlib";
import { CharacterActor } from "../data/character";


// Define how we set up our roll buttom command here - gets dropped in the template
// Then we know what params will be passed to the api function.
export function GenerateReloadCommand(index, itemFields){
    //send the indexed key so we can query on it as we will need the full attr object for setting anyway.
    let params = {
        item: index,
        characterid: '@{character_id}',
        type: `@{${itemFields.ammotype.key}}`,
        ammo: `${itemFields.ammo.key}`,
        durability: `${itemFields.durability.key}`,
        weaponname: `@{${itemFields.name.key}}`,
    }

    return '!!reload ' + generateParamString(params);
}



export function HandleReload(msg) {
    if (msg.type !== "api" || !msg.content.startsWith('!!reload')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg);
    
    let result = [];
    let charActor = new CharacterActor(character.id);
    
    let resultTitle = `${character.get('name')} attempts to reload their ${args.weaponname}!`;

    let ammoField = charActor.getAttr(args.ammo),
        durabilityField = charActor.getAttr(args.durability),
        ammoStoreField = charActor.getAttr(args.type);

        console.log()

    let ammo = parseInt(ammoField.get('current'), 10) || 0,
        ammoMax = parseInt(ammoField.get('max'), 10) || 0,
        ammoStore = parseInt(ammoStoreField.get('current'), 10) || 0,
        durability = parseInt(durabilityField.get('current'), 10) || 0;
        
    // get diff between max and curr, but limit it to size of store.
    // factors in scenarios if max < curr 
    const calculateAmmo = function (curr, max, store){
        return Math.min( Math.max(max - curr, 0), store);
    }

    let ammoToAdd = calculateAmmo(ammo, ammoMax, ammoStore);

    if (ammoToAdd == 0){
        //already full
        return;
    }

    if (ammoStore <= 0){
        result.push({label: 'Failed to Reload', value:`${character.get('name')} has 0 ammo!`});

        outputDefaultTemplate(result, resultTitle, sender);
        return;
    }


    ammoField.setWithWorker({current: ammo + ammoToAdd});
    ammoStoreField.setWithWorker({current: ammoStore - ammoToAdd});
    durabilityField.setWithWorker({current: Math.max(durability - 1, 0)});

    result.push({label: 'Success', value:`${character.get('name')} reloads!`});

    if (durability - 1 <= 0){
        result.push({label: 'Weapon Broken!', value: `${args.weaponname} is Broken!`})
    }

    outputDefaultTemplate(result, resultTitle, sender);
}