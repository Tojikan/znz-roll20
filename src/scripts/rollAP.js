import { fields as character } from '../model/character';
import { getAttr, getAttrVal, spendResource } from './_helpers';

/**
 * Roll System where we use a declining Pool of dice.
 * 
 * For each roll, we roll up to a single specified pool amount. Each roll is compared against a target success number to obtain a number of successes.
 * 
 * Then we can subtract a cost from a specified attribute. Usually want to subtract the pool by 1.
 * 
 */
export const RollAP = (function(){
    const handleResults = function(response, sender, character){
        let output = `&{template:default} {{name=${response.title || 'AP Roll'}}}`;

        //Action flavor text
        if ('action' in response){
            output += ` {{action=${response.action}}}`;
        }


        if ('fail' in response){
            output += ` {{failure=${response.fail}}}`;
        }

        if ('roll' in response){

            let multi = response.multiply.field || 1;            

            // do roll separately so we can reference them later on as per https://wiki.roll20.net/Reusing_Rolls
            output += ` [[[[${response.roll}]]*[[${multi}]]]] `;

            output += ` {{Roll= $[[0]] Successes!}} `;

            
            if ('multiply' in response){
                output += ` {{${response.multiply.label}=$[[0]] * $[[1]]==$[[2]] }}`;
            }
        }
        
        sendChat(sender, output);
    },


    /**
     * Roll Logic - subtract costs, generate a roll text and return
     * 
     * @param {*} args 
     * @param {*} character 
     * @returns 
     */
    handleRoll = function(args, character){
        const params = setupParams(args);
        const result = {title: args.title, action: args.action};


        if (params.cost > 0){
            if (!character){
                throw 'Attempted to subtract resource without specifying a target token!';
            }

            log(params.resource);

            for (let res of params.resource){
                let val = getAttrVal(character, res.field);
                
                //check if we can roll at all 
                if (val - params.cost < 0){
                    result.fail = `${character.get('name')} does not have enough ${res.label}!`;
                    return result;
                }
            }

            // Loop again for spending resource  as we want to make sure the first loop catches any failures first
            for (let res of params.resource){
                spendResource(params.cost, res.field, character);
            }
        }


        if (params.multiply.length){
            result.multiply = params.multiply[0];
        }

        result.roll = generateRollText(params.pool, params.dice, params.target, params.modifier, params.difficulty);

        return result;
    },

    /**
     * Generates a roll command.
     * 
     * @param {int} dice - dice to use
     * @param {int} dicemod - modifiers on dice
     * @param {int} amount - amount of dice
     * @param {int} mod - modifier on each roll
     */
    generateRollText = function(amount, dice, target, mod = 0, dicemod = 0){
        let result = '';

        //Why subtract?
        //Since we are using less than for comparison (<), smaller dice is better. 1 is the best roll we can get.
        //But we want positive values on the sheet to symbolize improvements. 
        //So subtract instead of add as positive values would then improve rolls and negative would then make it worse.
        let totalDice = dice - dicemod;
        let modifier = (mod != 0) ? `-${mod}` : '';

        return `{${amount}d${totalDice}${modifier}}<${target}`
    },

    defaultParams = function(){
        return {
            dice: 10,
            pool: 10,
            cost: 1,
            target: 3,
            multiply: '',
            resource: `${character.stats.ap.id}:${character.stats.ap.label}`,
            modifier: '',
            difficulty: '',
            title: 'AP Roll',
            action: ''
        };
    },

    /**
     * Parse Args for the roll. Multiple values for 1 param can be split by |
     * 
     * Args
     * @property {integer} dice                         - Which dice to use
     * @property {integer} pool                         - Amount of Dice for the roll.
     * @property {integer} cost                         - Cost per roll. Defaults to 1
     * @property {integer} target                       - Target Number to match to be considered a success.
     * @property {string}  multiply                     - Add a line to multiply results of the roll. Add label with : (example - prop:label)
     * @property {string}  resource                     - What char attr to subtract cost from. You can add a label with : (example - attr:label)
     * @property {integer or string} modifier           - add a modifier to each roll. Note this gets added on each dice in the pool
     * @property {integer or string} difficulty         - add a modifier to the dice itself. Modifies which dice you end up rolling.
     * 
     * @param {object} args 
     * @param {string} character 
     */
    setupParams  = function(args){
        const defParams = defaultParams();

        //overwrite default with provided args
        const params = {...defParams, ...args};

        if (!Number.isInteger(params.dice) || !Number.isInteger(params.pool) || !Number.isInteger(params.cost)){
            throw 'Invalid Parameters - expected an Integer!';
        }

        params.resource = parseFieldLabel(parseMultiArg(params.resource));
        params.modifier = sumValues(parseMultiArg(params.modifier));
        params.difficulty = sumValues(parseMultiArg(params.difficulty));
        params.multiply = parseFieldLabel([params.multiply], 'Effect');
        
        return params;
    },


    //sum up an array of strings
    sumValues = function(values){
        return values.reduce((prev, curr) =>{
            return prev + (Number.parseInt(curr, 10) || 0);
        }, 0)
    },

    //parse array of strings into an array of label/fields
    //use : to denote field:label
    parseFieldLabel = function(resources, defaultLabel = ''){
        const result = [];

        for (let res of resources){
            let split = res.split(':');

            if (split.length && split[0].length){
                let label = split[1] || (defaultLabel.length ? defaultLabel : split[0]);
                result.push({
                    field: split[0].trim(),
                    label: label.trim()
                });
            }
        }

        return result;
    },

    //Split among pipe so we can have multiple args
    parseMultiArg = function(arg){
        return arg.toString().split('|').map(x => x.trim()).filter(x => x);
    }

    //TODO - probably a cleaner way to do this but otherwise we get errors with missing functions and stuff
    return {
        caller: '!!aproll',
        handler: handleRoll,
        responder: handleResults,
        generateRollText: generateRollText,
        parseFieldLabel: parseFieldLabel,
        parseMultiArg: parseMultiArg,
        defaultParams: defaultParams,
        sumValues: sumValues,
        setupParams: setupParams
    }
})();
