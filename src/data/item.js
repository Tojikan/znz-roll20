export const ItemModel = {
    name:{key:"name"},
    type:{key:"type"},
    description: {key:"description"},
    quantity:{key:"quantity"},
    melee:{key:"melee"},
    ranged:{key:"ranged"},
    block:{key:"block"},
    durability:{key:"durability", max:true},
    ammo:{key:"ammo", max:true},
    ammotype:{key:"ammotype", select: true},
}


export const Equipped = {key:"equipment"}



export const ItemTypes = {
    misc: {key: 'misc'},
    melee: {key: 'melee'},
    ranged: {key: 'ranged'},
    armor: {key: 'armor'},
    thrown: {key: 'thrown'},
}



export class ItemActor{
    
    constructor(index='', characterId){
        this.index = index;
        this.data = ItemModel;
        this.characterId = characterId;
    }

    /**
     * Returns the attr key with index if there is one.
     */
    indexAttrKey(attrKey){
        return (this.index) ? `${this.index}_${attrKey}` : attrKey;
    }

    /**
     * Gets a full attribute object
     * @param {*} attrKey 
     * @returns attribute object
     */
    getAttr = function(attrKey){
        return findObjs({type: 'attribute', characterid: this.characterId, name: generateAttrKey(attrKey)})[0];
    }

    getUnindexedAttr = function(attrKey){
        return findObjs({type: 'attribute', characterid: this.characterId, name: attrKey})[0];
    }


    /**
     * Wrapper around roll20's getAttrByName. 
     * Gets the value of an attribute but uses the field's default value if not present.
     * 
     * @param {string} attr name of the attribute
     * @param {boolean} getMax get Max value instead of current if set to true.
     * @returns 
     */
    getAttrVal = function(attrKey, getMax = false){
        return getAttrByName(this.characterId, generateAttrKey(attrKey), (getMax ? 'max' : 'current'));
    }

    /**
     * Set Attribute current value.
     * @param {*} attr
     * @returns 
     */
    setAttrVal(attrKey){
        let attr = this.getAttr(attrKey);
        let prev = attr.get('current');
        attribute.setWithWorker({current: value});

        return {
            prev: prev,
            value: value
        }
    }


    spendAmmo(){
        let ammoAttr = this.getAttr(ItemModel.ammo.key),
            ammoVal = parseInt(ammoAttr.get('current'), 10) || 0;

        if (ammoVal <= 0){
            return false;
        }

        ammoAttr.setWithWorker({current: ammoVal - 1});

        //return 2 if we're empty otherwise just 1.
        return (ammoVal - 1 <= 0) ? 2 : 1;
    }


    spendDurability(){
        let durAttr = this.getAttr(ItemModel.durability.key),
            durVal = parseInt(durAttr.get('current'), 10) || 0;

        if (durVal <= 0){
            return false;
        }

        durAttr.setWithWorker({current: durVal - 1});

        //return 2 if we're empty after this attack otherwise just 1.
        return (durVal - 1 <= 0) ? 2 : 1;
    }


    get durability(){
        return parseInt(this.getAttrVal(ItemModel.durability.key), 10) || 0;
    }
}
