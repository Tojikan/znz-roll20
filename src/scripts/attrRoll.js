import { generateParamString } from "../lib/znzlib";
import { generatePoolRollCommand, generateRollResultText, outputDefaultTemplate, setupScriptVars } from "../lib/roll20lib";
import { CharacterActor } from "../data/character";

/**
 * Generates command for attr roll
 * @param {string} attribute - value of an attribute
 * @param {string} title - Title for roll
 * @param {fieldKey} attrKey - if you don't or can't get a value, set attribute to null and set this to the attrkey.
 * @returns 
 */
export function GenerateAttrRoll(attribute, title, rollBonus=0, attrKey=''){
    let params = {
        characterid: '@{character_id}',
        attribute: attribute ? `@{${attribute}}` : '',
        attrKey: attrKey,
        title: title,
        bonus: rollBonus,
    }

    return '!!aroll ' + generateParamString(params);
}




export function HandleAttrRoll(msg){
    if (msg.type !== "api" || !msg.content.startsWith('!!aroll')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg);
    const charActor = new CharacterActor(character.id);
    
    let attrVal;
    
    if (!args.attribute && args.attrKey){
        //if its a user supplied attribute, such as a variable skill.
        attrVal = charActor.getAttrVal(args.attrKey);
    } else if (args.attribute){
        attrVal = args.attribute;
    } else {
        throw('No attribute set!');
    }
    
    const title = `${character.get('name')} makes a ${args.title} roll!`;
    const results = [];

    const rollCommand = charActor.rollAgainst(attrVal, args.bonus);
    results.push(generateRollResultText(rollCommand));

    let fatigueAdded = charActor.addFatigue();
    if (fatigueAdded){
        results.push({label:'Gained Fatigue', value:fatigueAdded});
    };    

    outputDefaultTemplate(results, title, sender);
}