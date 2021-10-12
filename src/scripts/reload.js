import { getAttr } from "./_helpers"; 
import { fields as card} from '../model/card';
import { fields as charFields} from '../model/character';

export function handleReload(character, weaponId){
    const getAttrName = function(id, num){
        return `${charFields.weaponslots.type}_${id}_${num}`;
    }    

    const itemType = getAttr(character, getAttrName(card.type.id, weaponId)),
        weaponType = getAttr(character, getAttrName(card.weapontype.id, weaponId)),
        ammoType = getAttr(character, getAttrName(card.ammotype.id, weaponId)),
        ammo = getAttr(character, getAttrName(card.uses.id, weaponId)),
        active = getAttr(character, charFields.weaponslots.type + '_' + weaponId);

        log(active);
        
        if (!active){
            return {msg: "Error! Could not check item active!", type: "error"};
        } else if (!itemType){
            return {msg: "Error! Could not get item type!", type: "error"};
        } else if (!weaponType){
            return {msg: "Error! Could not get weapontype!", type: "error"};
        } else if (!ammoType){
            return {msg: "Error! Could not get ammotype!", type: "error"};
        } else if (!ammo){
            return  {msg: "Error! Could not get ammo!", type: "error"};
        } else if (itemType.get('current') !== 'weapon'){
            return {msg: "Error! Item is not a weapon!", type: "error"};
        } else if (weaponType.get('current') !== 'ranged'){
            return {msg: "Error! Item is not a ranged weapon!", type: "error"};
        }
        
        const ammoMax = ammo.get("max"),
            ammoStore = getAttr(character, ammoType.get('current')), //ammoType dropdown values are the attribute for the appropriate ammo store.
            isActive = active.get('current');
    
    if (!isActive){
        return  {msg: `Weapon ${weaponId} is not active!`, type: "warning"};
    } else if (!ammoMax){
        return  {msg: "Error! Could not get max ammo!", type: "error"};
    } else if (!ammoStore){
        return  {msg: "Error! Could not get ammo store!", type: "error"};
    }
    
    const current = parseInt(ammo.get('current'), 10) || 0,
        max = parseInt(ammoMax, 10) || 0,
        store = parseInt(ammoStore.get('current'), 10) || 0,
        reload = max - current,
        ammoText = ammoType.get('current').replace('ammo_', '');

    if (current >= max){
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



