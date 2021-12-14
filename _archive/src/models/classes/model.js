import { capitalize } from "../../lib/znzlib";

export class Model {
    constructor(model){
        this.model = model;
    }
    
    /**
     * Exports a model's fields into JSON. Generates an ID and label for each top level key in an object.
     * @param {boolean} flatten flatten lists into the main object so everything is 1 dimensional. This is dangerous as this will overwrite keys so make sure all keys are unique
     * @returns 
     */
    toJson(flatten=false){
        let keys = Object.keys(this.model);
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
            let obj = this.model[k];
            
            //For lists fields (such as skills), set up for each item in the list
            if (obj && 'list' in obj){
                retVal[k] = {...obj, list:{}};
        
                for (let opt of Object.keys(obj.list)){
                    //add a prefix to the option id
                    retVal[k].list[opt] = setupField(`${opt}`, obj.list[opt], k);
                }
                
                //If flatten, merge it back into the main object, deleting the original list.
                if (flatten){
                    retVal = {...retVal, ...retVal[k].list};
                    delete retVal[k].list;
                }

            } else {
                retVal[k] = setupField(k, obj);
            }
        }
        
        return retVal;

    }
}