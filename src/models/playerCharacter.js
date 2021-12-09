import { CharacterModel } from "./CharacterModel";

export class PlayerCharacter{

    /**
     * Set up character
     * @param {object} characterObj Object from Roll20, retrieve via findObjs or some other function
     */
    constructor(characterObj, getHandler, setHandler){
        this.character = characterObj;
        this.name = this.character.get('name');
        this.id = this.character.get('id');
        this.model = CharacterModel.toJson(true); //flatten the json to 1 dimensional to make it easier for our proxy
        this.fieldGetMax = false; //changeable property so that the proxy getter can get max


        /***
         * Setup a proxy so that accessing or setting a property in this.data will directly get/set it from Roll20
         * The proxy will call getAttrVal or setAttr when you get/set
         * 
         * This is definitely overkill but fun to learn soooo.. worth?
         * https://stackoverflow.com/questions/60218309/creating-dynamic-getters-and-setters-from-a-base-object-in-javascript
         * https://stackoverflow.com/questions/41299642/how-to-use-javascript-proxy-for-nested-objects
         */
        const modelProxy = {
            get: function(target, key) {
                
                // doing it this way lets us overwrite the handler in the constructor, which makes it easier to unit test or something
                let handler = (getHandler || function(target, key){
                    if ('id' in target[key]){
                        let val = this.getAttrVal(target[key].id);
                        return ( Number(val, 10) || val );
                    } else {
                        return null;
                    }

                }).bind(this);//double bind to get to class

                return handler(target, key);
            }.bind(this),//double bind to get to class
            set: function(target, key, value) {

                let handler = (setHandler || function(target, key, value){
                    if ('id' in target[key]){
                        this.setAttrVal(target[key].id, value);
                    } 
                    return true;
                }).bind(this);

                return handler(target, key, value)
            }.bind(this)
        };

        this.data = new Proxy(this.model, modelProxy);
    }

    /**
     * Retrieve an attribute object
     * @param {*} attribute 
     * @returns The Attribute object
     */
    getAttr = function(attr){
        return findObjs({type: 'attribute', characterid: this.character.id, name: attr})[0];
    }


    /**
     * Wrapper around roll20's getAttrByName. 
     * Gets the value of an attribute but uses the field's default value if not present.
     * 
     * @param {string} attr name of the attribute
     * @param {boolean} forceGetMax get Max value instead of current if set to true.
     * @returns 
     */
    getAttrVal(attr, forceGetMax=false){
        return getAttrByName(this.character.id, attr, (forceGetMax || this.fieldGetMax ? 'max' : 'current'));
    }    

    /**
     * Set Value of an attribute
     * 
     * @param {string} attr attribute name
     * @param {*} value value to set to
     */
    setAttrVal(attr, value){
        let attribute = this.getAttr(attr);

        if (!attribute){
            return null;
        }

        let prev = attribute.get('current');
        attribute.setWithWorker({current: value});

        return {
            prev: prev,
            value: value
        }
    }
}