
import { PlayerCharacter } from "../models/playerCharacter";


export const FatigueRoll = function(args, char, sender){
    if ('help' in args) {
        let output = `&{template:default} {{name=Basic Fatigue Roll Instructions}} {{instructions=Roll while adding fatigue/spending actions. Select character. Then roll with the following parameters}}`;
        output += `{{pool=Set number of dice to roll}}`;
        output += `{{target=Set target number for success}}`;
        output += `{{Example Command='!!fatroll pool=10 target=3' ==== rolls 10d10<3}}`;
        sendChat(sender, output);
        return;
    }


    if (!char){
        throw (`FatigueRoll Error - a character was not provided!`);
    }


    const rollArgs = verifyRollArgs(args),
        character = new PlayerCharacter(char),
        dice = 10, //assuming we stick with a d10? Change if needed
        hasCost = parseInt(character.data.rollcost, 10),
        poolMod = parseInt(character.data.rollmod, 10) || 0,
        fatigue = Math.max(parseInt(character.data.fatigue / 10, 10), 0),
        stdCost = 3;
    let totalPool = Math.max(rollArgs.pool + poolMod - fatigue, 1)

    let output = `&{template:default} {{name=${rollArgs.name || `${character.name} attempts a roll!`}}} `
    let rollText = generateRollText(dice, totalPool, rollArgs.target)

    if (hasCost){
        if (character.data.actions > 0){
            character.data.fatigue += stdCost;
            character.data.actions -= 1;
        } else {
            output += ` {{failure=${character.name} does not have enough actions remaining!}} `;
            sendChat(sender, output);
            return;
        }
    }

    const trauma = Math.max(parseInt((character.data.trauma / 10), 10), 0);

    if (trauma >= 1 ){
        output += ` [[[[${rollText}]]-[[${trauma} trauma]]]] `;
        output += ` {{Roll Result = $[[0]] - $[[1]] == $[[2]] Successes}}`
    } else {
        output += `{{Roll Result= [[${rollText}]] Successes}}`;
    }
    sendChat(sender, output);
}


function generateRollText(dice, pool, target){
    return `{${pool}d${dice}}<${target}`;
}

function verifyRollArgs(args){

    const expectedArgs = ['pool', 'target'];

    for (let arg of expectedArgs) {
        if (arg in args){
            let val = parseInt(args[arg], 10);

            if (isNaN(val)){
                throw(`FatigueRoll Error - '${arg}' must be an integer!`);
            }

            if (val <= 0){
                throw(`FatigueRoll Error - '${arg}' must be non-negative and non-zero!`);
            }

            args[arg] = val;
        } else {
            throw(`FatigueRoll Error - Missing required parameter '${arg}'`);
        }
    }

    return args;
}