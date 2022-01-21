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
export function GenerateAttackRoll(action, index, actionName, itemName){
    let params = {
        characterid: '@{character_id}',
        action: action,
        itemId: index,
        actionName: actionName,
        itemName: `@{${itemName}}`,
        charName: '@{character_name}',
    }

    return '!!attack ' + generateParamString(params);
}



export const HandleAttack = msg => (function(msg){
    if (msg.type !== "api" || !msg.content.startsWith('!!attack')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg),
        itemActor = new ItemActor(character.id, args.itemId),
        charActor = new CharacterActor(character.id),
        title = `${args.charName} attempts to ${args.actionName}!`,
        itemName = `${args.charName}'s ${args.itemName}`,
        result = [{label: 'Equipment', value: args.itemName}];


    //#region Actions
        const CheckDurability = function(){
            if (itemActor.data.durability <= 0){
                result.push({label: "Attack failed!", value: `${itemName} is broken!`});
                return false;
            }
            
            return true;
        }

        const GenerateRollResult = function( attribute, skill, multiplier, multiplyLabel){
            const rollCommand = charActor.roll(attribute, skill);
            return generateRollResultText(rollCommand, multiplier, multiplyLabel);
        };

        const RangedAttack = function(){
            const ammoSpent = itemActor.spendAmmo();

            if (ammoSpent == -1){
                result.push({label: "Attack failed!", value: `${itemName} is out of ammo!`});
                return;
            }
            
            result.push(GenerateRollResult(charActor.data.agility, charActor.data.ranged, itemActor.data.ranged, 'Ranged Damage'));
            
            if (ammoSpent == 0){
                result.push({label: "Warning", value: `${itemName} has ran out of ammo!`})
            }
        }

        const MeleeAttack = function(){
            const durSpent = itemActor.spendDurability();
            //we already do broke check up top, so we can assume the attack goes through

            result.push(GenerateRollResult(charActor.data.strength, charActor.data.melee, itemActor.data.melee, 'Melee Damage'));

            if (durSpent == 0) {
                result.push({label: "Warning", value: `${itemName} breaks and can no longer be used!`})
            }
        }

        const BlockAction = function(){
            const durSpent = itemActor.spendDurability();
            //we already do broke check up top, so we can assume the attack goes through

            result.push(GenerateRollResult(charActor.data.strength, charActor.data.block, itemActor.data.block, 'Damage Blocked'));

            if (durSpent == 0) {
                result.push({label: "Warning", value: `${itemName} breaks and can no longer be used!`});
            }
        }

        const ThrowAction = function(){
            const quantSpent = itemActor.spendQuantity();

            if (quantSpent == -1){
                result.push({label: "Attack failed!", value: `${args.charName} is out of ${args.itemName}!`});
                return;
            }

            result.push(GenerateRollResult(charActor.data.strength, charActor.data.throwing, itemActor.data.ranged, 'Throw Damage'));

            if (quantSpent == 0){
                result.push({label: "Warning", value: `${args.charName} is now out of ${args.itemName}!`});
            }
        }
        
        const MeleeThrow = function(){
            const durSpent = itemActor.spendDurability();

            result.push(GenerateRollResult(charActor.data.strength, charActor.data.throwing, itemActor.data.ranged, 'Throw Damage'));
            
            if (durSpent == 0){
                result.push({label: "Warning", value: `${itemName} breaks upon being thrown!`});
            }
        }

    //#endregion

    let check;

    switch(args.action) {
        case 'meleeattack':
            check = CheckDurability();
            if (check) MeleeAttack();
            break;
        case 'rangedattack':
            check = CheckDurability();
            if (check) RangedAttack();
            break;
        case 'blockaction':
            check = CheckDurability();
            if (check) BlockAction();
            break;
        case 'throwaction':
            if (check) ThrowAction();
            break;
        case 'meleethrow':
            check = CheckDurability();
            if (check) MeleeThrow();
            break;
        default: 
            throw('Unknown action type!');
    }
    
    charActor.addFatigue();
    outputDefaultTemplate(result, title, sender);
    
})(msg);


