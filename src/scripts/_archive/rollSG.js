import { getAttr } from './_helpers';

/**
 * Roll System where we roll a success and guard as a dual roll
 */
export const sgRoll = {
    /**
     * Parse a set of args to set up a sgRoll Dice Object.
     * 
     * Looks at these available args
     *  - success: Number of success rolls that determine if roll succeeds
     *  - guard: Number of guard rolls that determine defense against negative results.
     *  - - accepts integers, like 1,2,3 or XbX to add free bonus dice (2b2 means 2 dice + 2 free bonus dice.)
     *  - sdice / gdice: dice to use for success/guard respectively
     *  - sresource / gresource: an attribute to decrement per success/guard roll.
     *  - sbonus / gbonus: additive bonus onto the roll
     * 
     * 
     * @param {*} args 
     * @param {*} character 
     * @returns results of the roll.
     */
    handleRoll(args, character){
        if (!("success" in args) && !("guard" in args)){
            return {error: "Did not specify an amount of rolls!"};
        }
    
        if (!("sdice" in args) && !("gdice" in args)){
            return {error: "Did not specify the dice to roll."};
        }

        let rollResult = {}, // success and guard appended to this later on so its easier to type
            success = {
                original: this.parseRolls(args['success']).roll, //track original value before its changed
                rolls: this.parseRolls(args['success']).roll,
                bonusrolls: this.parseRolls(args['success']).bonusrolls,
                dice: args['sdice'] || 0,
                resource: args['sresource'],
                bonus: args['sbonus'] || 0
            },
            guard = {
                original: this.parseRolls(args['guard']).roll,
                rolls: this.parseRolls(args['guard']).roll,
                bonusrolls: this.parseRolls(args['guard']).bonusrolls,
                dice: args['gdice'] || 0,
                resource: args['gresource'],
                bonus: args['gbonus'] || 0
            },
            limit = parseInt(args['limit'], 10) || null;
            
        // Spend a given resource up to the amount of dice rolled, but if resources are exhausted, reduce rolls.
        const spendResource = this.spendResource;//so we can call this function  within calculateResource
        const calculateResource = function(type){
    
            if (type.resource){
                let resourceSpend = spendResource(type.rolls, type.resource, character);

                log(resourceSpend);
    
                if (resourceSpend && resourceSpend.spent < type.rolls){
                    type.rolls = resourceSpend.spent;
                    type.resourceLimited = true;
                }
    
                type.resourceSpend = resourceSpend;
            }
        }
    
        calculateResource(success);
        calculateResource(guard);
    
    
        // Limit total rolls to a certain number
        if (limit && limit > 0){
            rollResult.limit = limit;
    
            
            while (success.rolls + guard.rolls > limit){
                //decrease guard first
                if (guard.rolls > 0) {
                    guard.limited = true;
                    guard.rolls--;
                } else if (success.rolls > 0){
                    success.limited = true;
                    success.rolls--;
                } else {
                    //Only way to get here would be if limit is negative or something.
                    return {error: "You did something with negative numbers, didnt you?"}
                }
            }
        }


    
        
        success.rolltext = this.generateRollText(success.rolls + success.bonusrolls, `${success.dice} + ${success.bonus}` );
        guard.rolltext = this.generateRollText(guard.rolls + guard.bonusrolls, `${guard.dice} + ${guard.bonus}` );
    
    
        rollResult.success = success;
        rollResult.guard = guard;
    
        return rollResult;
    },
    
    parseRolls(text){
        return {
            roll: parseInt(text.toString().split('b')[0], 10) || 0,
            bonusrolls: parseInt(text.toString().split('b')[1], 10) || 0
        }
    },
    
    
    //generate rolltext in the form of {{dice,dice,dice}}
    generateRollText(amount, dice){
    
        let rollText = '';
    
        for (let i = 0; i < amount; i++){
            rollText += dice
    
            if (i < amount - 1){
                rollText += ','
            }
        }

        if (!rollText.length){
            rollText = 0;
        }
    
        return `{{${rollText}}}`;
    },
    
    //Spend 1 of the given attribute per roll.
    spendResource(amount, resource, character){
        let attr = getAttr(character, resource);
    
        if (!attr){
            return null;
        }
    
        let current = attr.get('current'),
            newVal = Math.max( current - amount, 0); //floor it at 0
    
        
        attr.setWithWorker({current: newVal});
    
        return {
            spent: current - newVal,
            remaining: newVal,
            initial: current
        }
    }
}
