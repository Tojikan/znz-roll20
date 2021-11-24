
import { capitalize } from "lodash";


export class Model {
    constructor(model){
        this.model = model;
    }

    
    /**
     * Exports a model's fields into JSON. Generates an ID and label for each top level key in an object.
     * 
     * @param {object} fields 
     * @returns 
     */
    export(){
        let keys = Object.keys(fields);
        let retVal = {};
        
        // Inner function for setting ID and Label
        const setupField = function(key, obj, prefix=''){
            let result = {...obj};
            
            //Set ID based on key if none provided
            if (!('id' in obj)){
                result.id = key;
            }
        
            //Set label based on key if none provided
            if (!('label' in obj)){
                result.label = capitalize(key);
            }   
        
            //Add prefix to the id.
            if (prefix.length){
                result.id = `${prefix}_${result.id}`;
            }
            
            return result;
        }
        
        for (let k of keys){
            let obj = fields[k];
            
            //For lists fields (such as skills), set up for each item in the list.
            if (obj && 'list' in obj){
                retVal[k] = {...obj, list:{}};
        
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
}