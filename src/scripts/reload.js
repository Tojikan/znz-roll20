import { getAttr, getAttrVal } from "./_helpers"; 
import { fields as card} from '../model/card';
import { fields as charFields} from '../model/character';
import { spendResource } from "./_helpers";

const handleResults = function(response, sender, character){
    let title = 'Reload';

    if ('title' in response){
        title = response.title;
    }

    let output = `&{template:default} {{name=${response.title}}} {{${response.result.label}=${response.result.value}}} `;
    sendChat(sender, output);
};

const handleReload = function(args, character){
    if (!'id' in args || !'type' in args || !'max' in args){
        throw 'Invalid Parameters - requires ID and Type and Max param';
    }

    let result = {};

    if ('title' in args){
        result.title = args.title;
    }

    let ammo = getAttr(character, args.id),
        max = getAttr(character, args.max), //because sheet is using uses_max_5 instead of a proper max field, we have to get this separate
        ammoType = getAttr(character, args.type),
        ammoTypeLabel = (function(id){
            for (let type in charFields.ammo.options){
                if (id == type.id){
                    return type.fulllabel;
                }
            }
            return 'Ammo'
        })(args.type);

        
        
    let currentAmmo = parseInt(ammo.get('current'),10) || 0,
        maxAmmo = parseInt(max.get('current'),10) || 0,
        currentStore = parseInt(ammoType.get('current'),10) || 0;
    
    if (currentStore <= 0){
        result.result = {label: 'Failed to Reload', value:`${character.get('name')} does not have enough ${ammoTypeLabel}!`}
        return result;
    }
    

    let ammoToAdd = calculateAmmo(currentAmmo, maxAmmo, currentStore);

    if (ammoToAdd == 0){
       result.result = {label: 'No Reload needed', value:`Weapon is already at full Ammo!`}
       return result;
    }

    // Subtracts from AP if cost is provided
    // Note that AP is hardcoded in here
    if ('cost' in args && args.cost > 0){
        if (!character){
            throw 'Attempted to subtract resource without specifying a target token!';
        }

        let val = getAttrVal(character, charFields.stats.ap.id);

        //check if we can roll at all 
        if (val - parseInt(args.cost, 10) < 0){
            result.result = {label: 'Failed to Reload', value:`${character.get('name')} does not have enough AP!!`};
            return result;
        }


        spendResource(args.cost, charFields.stats.ap.id, character);
    }

    ammo.setWithWorker({current: currentAmmo + ammoToAdd});
    ammoType.setWithWorker({current: currentStore - ammoToAdd});
    
    result.result = {label: 'Success', value:`${character.get('name')} reloads!`};
    return result;
}


// get diff between max and curr, but limit it to size of store.
// factors in scenarios if max < curr 
const calculateAmmo = function (curr, max, store){
    return Math.min( Math.max(max - curr, 0), store);
}



export const reload = {
    caller: '!!reload',
    handler: handleReload,
    responder: handleResults,
    calculateAmmo: calculateAmmo
}

