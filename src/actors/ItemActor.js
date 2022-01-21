import { ItemModel } from "../data/item";
import { affixKey, objMap } from "../lib/znzlib";
import { Actor } from "./Actor";

// Remember that get() in this.data and this.attrs calls the Roll20 API so try to cache into a variable if you can.
export class ItemActor extends Actor {
    constructor(characterId, itemId){
        let itemFields = ( itemId ) ? objMap(ItemModel,(x) => affixKey(itemId, x, null)) : ItemModel;

        super(characterId, itemFields);
        this.itemId = itemId;
    }


    spendAmmo(){ return this.spendResource(this.attrs.ammo)}
    spendDurability(){ return this.spendResource(this.attrs.durability)}
    spendQuantity(){ return this.spendResource(this.attrs.quantity)}
    
    /**
     * Spend 1 of an attribute
     * @param {*} attribute full attribute
     * @returns 1 if success, 0 if success but causes attr to be 0, -1 if failed.
     */
    spendResource(attribute){
        let val = attribute.get('current');
        
        //returns negative if nothing could be spent.
        if ( val <= 0){
            return -1;
        }
        
        attribute.setWithWorker({current: val - 1});
        
        //Check if this spend causes attribute to be 0.
        return (val - 1) <= 0 ? 0 : 1;
    }
}