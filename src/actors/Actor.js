
/**
 * Base class for an Actor. We just need a character ID.
 */
export class Actor{
    constructor(characterId, fields){
        this.characterId = characterId;
        this.fields = fields;


        /**
         * Proxy for getting/setting character attribute. The proxy will call the Roll20 API
         * in order to get/set an attribute
         */
        const dataProxy = {
            get: function(target, key){ 
                let val = this.getAttrVal(target[key].key);
                return ( Number(val, 10) || val);
            }.bind(this),
            set: function(target, key, value){
                return this.setAttrVal(target[key].key, value);
            }.bind(this),
        }
        
        /**
         * Proxy for retrieving the full character attribute.
         */
        const attrProxy = {
            get: function(target, key){
                return this.getAttr(target[key].key);
            }.bind(this)
        }


        /**
         * Remember these proxies make API calls...So best to cache the results as much as possible
         */
        this.data = new Proxy(this.fields, dataProxy);
        this.attrs = new Proxy(this.fields, attrProxy);
    }


    /**
     * Gets a full attribute object
     * @param {*} attrKey 
     * @returns attribute object
     */
    getAttr(attrKey){
        return findObjs({type: 'attribute', characterid: this.characterId, name: attrKey})[0];
    }
    
    /**
     * Gets the value of an attribute but uses the field's default value if not present.
     * @param {string} attr name of the attribute
     * @param {boolean} getMax get Max value instead of current if set to true.
     * @returns 
     */
    getAttrVal(attrKey, getMax = false){
        return getAttrByName(this.characterId, attrKey, (getMax ? 'max' : 'current'));
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