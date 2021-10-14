export const fields = {
    name: {
        id: 'name'
    },
    type: {
        id: 'type',
        label: "Item Type",
        options: [
            'inventory',
            'weapon',
            'equipment'
        ]
    },
    damage: {
        id: 'damage'
    },
    weapontype: {
        id: 'weapontype',
        options: [
            'melee',
            'ranged'
        ],
        label: 'Weapon Type',
        default: 'melee'
    },
    uses: {
        id: 'uses',
        max: true,
        labels: {
            melee: 'Durability',
            ranged: 'Ammo'
        }
    },
    // ammotype: {
    //     id: 'ammotype',
    //     label: 'Ammo Type'
    // },
    description: {
        id: 'description'
    }, 
    flavor: {
        id: 'flavor'
    },
}


export const options = {
    actions: {
        export:'exportitem', 
        delete:'deleteitem',
        attack:'attackweapon',
        reload: 'reloadweapon',
        equip: 'equipitem',
        unequip: 'unequipitem'
    }
}