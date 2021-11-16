import * as itemTypes from './itemtypes.json';

export const fields = {
    name: {
        id: 'name'
    },
    type: {
        id: 'type',
        label: 'Item Type',
        options: itemTypes
    },
    damage: {
        id: 'damage'
    },
    uses: {
        id: 'uses',
        max: 'uses_max', // easier to handle ids and indexflight from rochesbalti
        labels: {
            ranged: 'Ammo',
            other: 'Durability',
        }
    },
    cost: {
        id:'cost',
        label: 'AP Cost'
    },
    ammotype: {
        id: 'ammotype',
        label: 'Ammo Type',
    },
    description: {
        id: 'description'
    }, 
    flavor: {
        id: 'flavor'
    }
}


export const options = {
    actions: {
        export:'exportitem', 
        delete:'deleteitem',
        attack:'attackweapon',
        reload: 'reloadweapon',
        equip: 'equipitem',
        unequip: 'unequipitem'
    },
    itemtypes: itemTypes
}