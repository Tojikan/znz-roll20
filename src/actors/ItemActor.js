import { ItemModel } from "../data/item";
import { affixKey, objMap } from "../lib/znzlib";
import { Actor } from "./Actor";

export class ItemActor extends Actor {
    constructor(characterId, itemId, fields){
        this.itemId = itemId;

        let itemFields = ( this.itemId ) ? objMap(ItemModel,(x) => affixKey(this.itemId, x, null)) : ItemModel;

        super(characterId, itemFields);
    }


    spendAmmo(){
        let ammoCount = this.data.ammo;

        if (ammoCount <= 0){
            return false;
        }

        this.data.ammo = ammoCount - 1;

        //We want to know if this spend causes ammo to be 0. If so, returns 2.
        return (ammoCount - 1 <= 0) ? 2 : 1;
    }

    spendDurability(){
        let durVal = this.data.durability;

        if (durVal <= 0){
            return false;
        }
        
        this.data.durability = durVal - 1;

        //Want to check if this spend causes durability to be 0. If so, returns 2.
        return (durVal - 1 <= 0) ? 2 : 1;
    }
}