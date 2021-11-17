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
    attacks: {
        id:'accuracy',
        label: 'Difficulty Mod',
        min: 1,
        default: 3,
        max: 5
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
        // export:'exportitem', 
        // delete:'deleteitem',
        // attack:'attackweapon',
        // reload: 'reloadweapon',

        attackblunt: {
            id:'attackblunt',
            class: [
                itemTypes.blunt
            ],
            type: 'roll',
            label: 'Attack'
        },

        export: {
            id: 'exportitem',
            class: [
                'inventory'
            ]
        },
        delete: {
            id:'deleteitem',
            class: [
                'inventory'
            ]
        },
        equip: {
            id: 'equipitem',
            class: [
                'inventory'
            ],
            type: 'action',
            label: 'Equip'
        },
        unequip: {
            id: 'unequipitem',
            class: [
                'inventory'
            ],
            type: 'action',
            label: 'Unequip'
        }

    },
    itemtypes: itemTypes
}