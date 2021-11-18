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
        id: 'damage',
        default: 2
    },
    uses: {
        id: 'uses',
        max: 'uses_max', // easier to handle ids and indexflight from rochesbalti
        labels: {
            ranged: 'Ammo',
            other: 'Durability',
        }
    },
    accuracy: {
        id:'accuracy',
        label: 'Accuracy Mod',
        default: 0
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
        export: {
            id: 'exportitem'
        },
        delete: {
            id:'deleteitem'
        },
        dodge: {
            id:'dodge'
        },
        equip: {
            id: 'equipitem',
            type: 'action',
            label: 'Equip'
        },
        unequip: {
            id: 'unequipitem',
            type: 'action',
            label: 'Unequip'
        }

    },
    itemtypes: itemTypes
}