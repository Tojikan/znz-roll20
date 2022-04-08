import { generateParamString } from "../lib/znzlib";
import { generateRollResultText, outputDefaultTemplate, setupScriptVars } from "../lib/roll20lib";
import { CharacterActor } from "../actors/CharacterActor";

/**
 * Generates command for attr roll
 * @param {string} attribute - value of an attribute
 * @param {string} title - Title for roll
 * @param {number} rollBonus - Additional skill bonus. Not bonus rolls.
 * @param {fieldKey} attrKey - if you can't get a value prior, you can pass in the attribute name here and the script will look it up instead if attribute is null.
 * @returns 
 */
export function GenerateAttrRoll(attribute, title, rollBonus=0){
    let params = {
        characterid: '@{character_id}',
        attribute: attribute,
        title: title,
        bonus: rollBonus,
    }

    return '!!aroll ' + generateParamString(params);
}


export function HandleAttrRoll(msg){
    if (msg.type !== "api" || !msg.content.startsWith('!!aroll')){
        return;
    }

    const {args, sender, character} = setupScriptVars(msg),
        charActor = new CharacterActor(character.id),
        title = `${character.get('name')} makes a ${args.title} roll!`,
        results = [];

    const rollCommand = charActor.roll(charActor.data[args.attribute], args.bonus);
    results.push(generateRollResultText(rollCommand));

    let fatigueAdded = charActor.addFatigue();
    if (fatigueAdded){
        results.push({label:'Gained Fatigue', value: fatigueAdded});
    };

    outputDefaultTemplate(results, title, sender);
}