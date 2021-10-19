import { zRoll } from "./zroll";
import { getAttrVal } from "./_helpers";
import { fields as charFields } from '../model/character';



const handleCombat = function(args, character){
    const result = zRoll.handleRoll(args, character);

    const response = {
        result: result,
        weapon: args['weaponname'] || 'Weapon',
        type: args['type'] || null,
        actions:  getAttrVal(character, charFields.stats.ap.id),
        charname: character.get('name'),
        attemptedAttacks: result.success.original,
        attemptedDefense: result.guard.original,
        actualAttacks: result.success.rolls,
        actualDefense: result.guard.rolls,
        bonusAttacks: result.success.bonusrolls,
        bonusDefense: result.guard.bonusrolls,
        attackBonus: result.success.bonus,
        defenseBonus: result.guard.bonus,
        attackDice: result.success.dice,
        guardDice: result.guard.dice,
        successLimited: result.success.limited,
        guardLimited: result.success.limited,
        resourceLimited: result.success.resourceLimited,
        attackRoll: result.success.rolltext,
        defenseRoll: result.guard.rolltext,
    };

    return response;
}

const renderResults = function(response, sender, character){
    if ('error' in response.result) {
        sendChat('Attack Script Error', `<div style="color: red">${result.error}</div>`);
    } else if (response.attackRoll && response.defenseRoll){
        let output = `&{template:zroll} {{name=${response.charname} enters into Combat!}} `;

        let description = `**Attempted:** ${response.attemptedAttacks} attacks  &#124;  ${response.attemptedDefense} defense  \n`;
        description += `**Actual:** ${response.actualAttacks} attacks  &#124;  ${response.actualDefense} defense  \n`;
        description += `**Weapon:** ${response.weapon} \n`;
        description += `**Attack Dice:** ${response.attackDice} + ${response.attackBonus}  \n`;
        description += `**Defense Dice:** ${response.guardDice} + ${response.defenseBonus} \n`;

        if (response.bonusAttacks > 0){
            description += `**Bonus Attack Rolls:** ${response.bonusAttacks}  \n`;
        }

        if (response.bonusDefense > 0){
            description += `**Bonus Defense Rolls:** ${response.bonusDefense}  \n`;
        }

        description += `**Available AP:**${response.actions} \n`;


        output += ` {{description=${description}}} {{successlabel=Attack}} {{guardlabel=Defense}} `;


        let msg = '';

        if (response.successLimited || response.guardLimited){
            msg += `***${response.charname} did not have enough AP to complete attempted actions*** \n`;
        }

        if (response.resourceLimited){
            if (response.type){
                if (response.type == 'melee'){
                    msg += `***${response.charname}'s  ${response.weapon} is broken!*** \n`;
                } else {
                    msg += `***${response.charname}'s  ${response.weapon} is out of ammo!*** \n`;
                }
            } else {
                msg += `***${response.charname}'s  ${response.weapon} is out of uses!*** \n`;
            }
        }

        output += ` {{message=${msg}}} `


        const getRollResult = function(obj){
            let rollResult = JSON.parse(obj[0].content);

            //We get a super nested result since its in a group. So just hardcode it and hope the result stays in the same format
            let rollText = rollResult.rolls[0].rolls[0][0].results.map(x => `[[${x.v}]]`).join(' ') || '';
            
            return {
                total: rollResult.total,
                text: rollText
            };
        }

        

        // Roll Attack
        sendChat('', `/roll ${response.attackRoll}`, function(obj){

            let result = getRollResult(obj);

            output += ` {{success=${result.total}}} {{successrolls=${result.text}}} `;

            // Roll Defense
            sendChat('', `/roll ${response.defenseRoll}`, function(obj){

                let result = getRollResult(obj);

                output += ` {{guard=${result.total}}} {{guardrolls=${result.text}}} `;

                //now finally send the message
                sendChat(sender, output);
            });
        });
    } else {
        log('Unknown Combat Script Error');
        log(response);
        sendChat('Attack Script Error', `<div style="color: red">Something happened but I don't know what.</div>`);
    }

}





export const combat = {
    caller: '!!combat',
    handler: handleCombat,
    responder: renderResults,
    requires: ['character']
} 