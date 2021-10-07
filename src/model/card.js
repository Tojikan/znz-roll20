import { fields as char} from "./character";


const ammotypes = char.ammo.types.map(x=> char.ammo.id + '_' + x);

export var fields = {
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
        options: ammotypes,
        label: 'Ammo Type',
        default: ammotypes[0]
    },
    description: {
        id: 'description'
    }, 
    flavor: {
        id: 'flavor'
    },
    actions: {
        export:'exportitem', 
        delete:'deleteitem',
        attack:'attackweapon',
        reload: 'reloadweapon',
        equip: 'equipitem',
        unequip: 'unequipitem',
    }
}