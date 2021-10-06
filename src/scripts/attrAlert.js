


export function attrAlert(obj, prev){
    const watchedAttr = [
        "(([[data.character.stats.health.id]]))",
        "(([[data.character.stats.energy.id]]))",
        "(([[data.character.slots.weaponslots.id]]))",
        "(([[data.character.slots.equipmentslots.id]]))",
        "(([[data.character.slots.inventoryslots.id]]))"
    ];
    const ammoId = "(([[data.character.ammo.id]]))";
    const ammoTypes = (([[data.character.ammo.types]]));
    let attr = '';

    for (let ammo of ammoTypes){
        watchedAttr.push(`${ammoId}_${ammo}`);
    }

    if (watchedAttr.includes(obj.get("name"))){
        attr = obj.get("name").replace('ammo_', '');
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
        `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')}'s ${attr} attribute was changed!</strong><div> <div>Previous Value:  ${prevVal}</div><div> New Value: ${curVal} .</div></div>`
    );

    if (curVal <= 0){
        textColor = '#8B0000';
        bgColor = '#FFA07A';
        sendChat(
            'Attribute Alert - Reached Zero!',
            `<div style="padding:1px 3px;border: 1px solid ${textColor};background: ${bgColor}; color: ${textColor}"><strong>${character.get('name')} reached 0 ${attr} points!</strong></div>`
        );
    }    
}


