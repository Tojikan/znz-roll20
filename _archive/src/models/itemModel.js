import { Model } from "./classes/model";

export const ItemModel = new Model(
    {
        name: {key:'name'},
        type: {key:'type'},
        quantity: {key: 'quantity'},
        damage: {key:'damage'},
        block: {key:'block'},
        durability: {key:'durability', max:true},
        ammo: {key:'ammo', max: true},
        note: {key:'note'},
        blockcost: {key:'blockcost'},   
    }
)

export const ItemTypes = {
    melee: {
        key:'melee', 
        actions: [

        ]
    },
    ranged: {
        key:'ranged', 
        actions: [

        ]
    },
    armor: {
        key:'armor', 
        actions: [

        ]
    },
    consumable: {key:'consumable'},
    action: {key:'action'},
}