import { fields as charFields } from '../model/character';
import { fields as card } from '../model/card';
import { getAttr } from './_helpers';




export function handleAttack(character, args){

    if (!("rolls" in args)){
        return {msg: "You must specify the number of rolls!", type:"error"};
    }

    if (!("dice" in args)){
        return {msg: "You must specify the dice roll!", type:"error"};
    }

    
    let amount = args['rolls'];
    let msgText = '';
    let type='success';

    if ("resource" in args){
        let resources = spendResource(args['rolls'], args['resource'], character)
        
        if (!resources){
            return {msg: "Could not spend resource!", type:"error"};
        }

        amount = resources.spent;
        msgText = `${character.get('name')} spent ${amount} ${args['resource']}!`;

        if (resources.exhausted){
            msgText += `${character.get('name')} has run out of ${args['resource']}`;
            type = 'warning';
        } else {
            msgText += `${character.get('name')} has ${resources.remaining} ${args['resource']} remaining!`;
        }

    }

    let rollText = generateRollText(amount, args['dice']);

    return {msg: msgText, roll: rollText, type:type};
}


function generateRollText(amount, dice){

    let rollText = '';

    //generate rolltext in the form of {{dice,dice,dice}}
    for (let i = 0; i < amount; i++){
        rollText += dice

        if (i < amount - 1){
            rollText += ','
        }
    }

    return `{{${rollText}}}`;
}


function spendResource(amount, resource, character){
    let attr = getAttr(character, resource);

    if (!attr || !Number.isInteger(amount)){
        log(resource);
        log(attr);
        return null;
    }

    let current = attr.get('current'),
        newVal = Math.floor( current - amount, 0);

    
    attr.setWithWorker({current: newVal});

    return {
        spent: current - newVal,
        exhausted: (newVal == 0),
        remaining: newVal
    }
}