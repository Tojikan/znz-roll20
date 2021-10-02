

class Character {
    __constructor(){
    }

    static fields = {
        name: "name",
        ammo: {
            id: "ammo",
            types: [
                "d4",
                "d6",
                "d8",
                "d10",
                "d12",
            ]
        },
        stats: {
            health: {
                default: 30,
                max: true
            },
            energy: {
                default: 60,
                max: true
            }
        },
        defense: {
            id: "defense",
            label: "Defense",
            default: 5,
            bonus: {
                id: 'defense_bonus',
                default: 0
            }
        },
        weaponslot: {
            id: "weaponslot",
            max: 4,
            default: 1,
            slot_used: "weapon_equipped"
        },
        equipslot: {
            id: "equipslot",
            max: 6,
            default: 2,
            slot_used: "equip_equipped"
        },
        inventoryslot: {
            id: "inventoryslot",
            max: 10,
            default: 4,
            slot_used: "card_equipped"
        }
    }
}

module.exports = {
    fields: Character.fields,
}

