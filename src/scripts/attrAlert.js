import {fields as char} from "../model/character";


export function attrAlert(){

    on("change:attribute", function(obj, prev){
        //Key is the attribute name, value is the display name.

        const watchedAttr = [
            char.stats.health.id,
            char.stats.energy.id,
            char.weaponslots.id,
            char.equipmentslots.id,
            char.inventoryslots.id
        ];

        for (let ammo of char.ammo.types){
            watchedAttr.push(`${char.ammo.id}_${ammo}`);
        }
    
    
        if (obj.get("name") in watchedAttr){
            attr = watchedAttr[obj.get("name")];
        } else {
            return;
        }
    
    
        let textColor = '#456C8B',
            bgColor = '#CCE8F4',
            prevVal = prev['current'], //prev is a basic object without getters/setters
            curVal = obj.get('current'),
            character = getObj('character', obj.get('_characterid'));
    
        if (prevVal == curVal){
            return;
        }
    
    
        sendChat(
            'Attribute Alert',
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')}'s ${attr} resource was changed!</strong><div> <div>Previous Value:  ${prevVal}</div><div> New Value: ${curVal} .</div></div>`
        );
    
        if (curVal <= 0){
            textColor = '#8B0000';
            bgColor = '#FFA07A';
            sendChat(
                'Attribute Alert - Reached Zero!',
                `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} reached 0 ${attr} points!</strong></div>`
            );
        }    
    });
}


