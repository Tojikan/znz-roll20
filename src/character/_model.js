
import { capitalize } from "lodash";

/**
 * Exports a model's fields into JSON. Generates an ID and label for each top level key in an object.
 * 
 * @param {object} fields 
 * @returns 
 */
export function exportFields(fields){
    let keys = Object.keys(fields);
    let retVal = {};

    // Set ID and Label
    const setupField = function(key, obj, prefix=''){
        let result = {...obj};

        
        if (!('id' in obj)){
            result.id = key;
        }
        
        
        if (!('label' in obj)){
            result.label = capitalize(key);
        }

        if (prefix.length){
            result.id = `${prefix}_${result.id}`;
        }
        
        return result;
    }

    for (let k of keys){
        let obj = fields[k];
        
        //For lists of different attr, such as skills
        if (obj && 'list' in obj){
            retVal[k] = {list:{}};

            for (let opt of Object.keys(obj.list)){
                //add a prefix to the option id
                retVal[k].list[opt] = setupField(`${opt}`, obj.list[opt], k);
            }
        } else {
            retVal[k] = setupField(k, obj);
        }
    }

    return retVal;
}