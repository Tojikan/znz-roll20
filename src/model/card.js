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
        label: 'Weapon Type'
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
        label: 'Ammo Type'
    },
    description: {
        id: 'description'
    }, 
    flavor: {
        id: 'flavor'
    },
    actions: {
        drop:'dropItem', 
        delete:'deleteItem',
        attack:'attackWeapon',
        reload: 'reloadWeapon',
        equip: 'equipItem',
        unequip: 'unequipItem'
    }
}