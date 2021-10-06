import { getAttrVal } from "./_helpers"; 
import { fields as card } from "../model/card";


export function handleReload(character, weaponId){
    const itemType = getAttrVal(character, getAttrName(card.type.id, weaponId)),
        weaponType = getAttrVal(character, getAttrName(card.weapontype.id, weaponId)),
        ammoType = getAttrVal(character, getAttrName(card.ammotype.id, weaponId)),
        ammo = getAttrVal(character, getAttrName(card.uses.id, weaponId)),
        ammoMax = ammo.get("max"),
        ammoStore = getAttrVal(character, ammoType); //ammoType dropdown values are the attribute for the appropriate ammo store.
    
    if (itemType !== 'weapon'){
        return {msg: "Item is not a weapon.", type: "error"};
    } else if (weaponType !== 'ranged'){
        return {msg: "Item is not a ranged weapon.", type: "error"};
    } else if (!ammoType){
        return {msg: "Could not get ammotype!", type: "error"};
    } else if (!ammo){
        return  {msg: "Could not get ammo!", type: "error"};
    } else if (!ammoMax){
        return  {msg: "Could not get max ammo!", type: "error"};
    }


    const current = parseInt(ammo.get('current'), 10) || 0,
        max = parseInt(ammoMax, 10) || 0,
        store = parseInt(ammoStore.get('current'), 10) || 0,
        reload = max - current,
        ammoText = ammoType.get('current').replace('ammo_', '');

    if (current == max){
        return  {msg: "Weapon is already at max ammo!", type: "info"};
    }

    if (store <= 0){
        //No Ammo
        return {msg: `${character.get('name')} has no ${ammoText} ammo to reload with.`, type:"warning"}
    } else if (reload >= store){
        //Successful Reload - Partial Reload
        ammo.setWithWorker({current: store + current});
        ammoStore.setWithWorker({current: 0});
        return {msg: `${character.get('name')} reloads with the last of their ${ammoText} ammo.`, type:"warning"}
    } else {
        //Successful Reload - Full Reload
        ammo.setWithWorker({current: max});
        ammoStore.setWithWorker({current: store - reload});
        return {msg: `${character.get('name')} reloads. They have ${store - reload} ${ammoText} ammo remaining.`, type:"success"}
    }
}

const getAttrName = function(id, num){
    return `weapon_${id}_${num}`;
}

const cleanAmmo = function(x){
    return x.replace('ammo_', "");
}


