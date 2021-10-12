export const fields = {
    name: {
        id: 'itemname'
    },
    type: {
        id: 'itemtype',
        label: "Item Type",
        options: [
            'inventory',
            'weapon',
            'equipment'
        ]
    },
    damage: {
        id: 'itemdamage'
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
    ammotype: {
        id: 'ammotype',
        label: 'Ammo Type'
    },
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