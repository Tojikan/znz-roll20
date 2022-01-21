import { generateParamString } from "../lib/znzlib";
import { generateRollResultText, outputDefaultTemplate, setupScriptVars } from "../lib/roll20lib";
import { CharacterActor } from "../actors/CharacterActor";
import { ItemActor } from "../actors/ItemActor";

/**
 * Generates command for attr roll
 * @param {string} attribute - value of an attribute
 * @param {string} title - Title for roll
 * @param {fieldKey} attrKey - if you don't or can't get a value, set attribute to null and set this to the attrkey.
 * @returns 
 */
export function GenerateAttackRoll(action, index, title, weaponName){
    let params = {
        characterId: '@{character_id}',
        action: action,
        itemId: index,
        title: title,
        weapon: `@{${weaponName}}`,
        charName: '@{character_name}',
    }

    return '!!attack ' + generateParamString(params);
}



export const HandleAttack = msg => (function(msg){
    if (msg.type !== "api" || !msg.content.startsWith('!!attack')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg),
        itemActor = new ItemActor(character.id, args.index),
        charActor = new CharacterActor(character.id),
        title = args.title,
        itemName = `${args.charname}'s ${args.weapon}`,
        result = [];

    let checkDurability = true;

    switch(args.action) {
        case 'meleeattack':
                
            break;
        case 'rangedattack':

            break;
        case 'blockaction':

            break;
        case 'throwaction':

            break;
        case 'meleethrow':

            break;
        default: 
            return;
    }



    if (itemActor.data.durability <= 0){
        result.push[{label: "Attack failed!", value: `${itemName} is broken!`}];
        outputDefaultTemplate(results, title, sender);
        return;
    }






    const GenerateRollResult = function( attribute, skill, multiplier){
        const rollCommand = charActor.roll(attribute, skill);
        return generateRollResultText(rollCommand, multiplier);
    };

    const RangedAttack = function(){
        const ammoSpent = ItemActor.spendAmmo();
    
        if (!ammoSpent){
            return [{label: "Attack failed!", value: `${itemName} is out of ammo!`}];
        }
        
        result.push(GenerateRollResult(character.data.agility, character.data.ranged, itemActor.data.ranged));
        
        if (ammoSpent > 1){
            result.push({label: "Warning", value: `${itemName} has ran out of ammo!`})
        }
    }

    const MeleeAttack = function(){
        const durSpent = itemActor.spendDurability();
        //we already do broke check up top, so we can assume the attack goes through

        result.push(GenerateRollResult(character.data.strength, character.data.melee, itemActor.data.melee));

        if (durSpent > 1) {
            result.push({label: "Warning", value: `${itemName} breaks and can no longer be used!`})
        }
    }

    const BlockAction = function(){
        const durSpent = itemActor.spendDurability();
        //we already do broke check up top, so we can assume the attack goes through

        result.push(GenerateRollResult(character.data.strength, character.data.block, itemActor.data.block));

        if (durSpent > 1) {
            result.push({label: "Warning", value: `${itemName} breaks and can no longer be used!`});
        }
    }

    const ThrowAction = function(useDur){

        if (useDur){
            const durSpent = itemActor.spendDurability();

            if (durSpent > 1){
                result.push({label: "Warning", value: `${itemName} breaks upon being thrown!`});
            }
        }

        result.push(GenerateRollResult(character.data.strength, character.data.throwing, itemActor.data.ranged));
    }


})(msg);


