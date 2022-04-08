import { CharacterModel } from "../data/character"
import { objToArray } from "../lib/znzlib"




const watchedAttr = [
    ...objToArray(CharacterModel.resources).map(x => x.key),
    ...objToArray(CharacterModel.attributes).map(x => x.key),
    CharacterModel.equipmentslots.key,
    CharacterModel.inventoryslots.key,
]


/**
 * @param {*} obj 
 * @param {*} prev 
 */
export function attrAlert(obj, prev){
    let attr;

    if (watchedAttr.includes(obj.get("name"))){
        attr = obj.get("name");
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


export function setUpAttrAlert(fields){
    on('change:attribute', attrAlert(obj, prev));
}