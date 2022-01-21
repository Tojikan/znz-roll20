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
