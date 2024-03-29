
//"Item" is a reserved key because it's used in pickup, so don't use it as a key here.
export const ItemModel = {
    name:{key:"name"},
    type:{key:"type"},
    category: {key: "category"},
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
