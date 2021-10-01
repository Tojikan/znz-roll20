





module.exports = {
    name: "name",
    ammo: {
        id: "ammo",
        types: [
            "d4",
            "d6",
            "d8",
            "d10",
            "d12"
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
        label: "Weapons",
        max: 4,
        default: 2,
        slot_used: "weapon_equipped"
    },
    equipslot: {
        id: "equipslot",
        label: "Equipment",
        max: 6,
        default: 2,
        slot_used: "equip_equipped"
    },
    cardslot: {
        id: "cardslot",
        label: "Inventory",
        max: 10,
        default: 7,
        slot_used: "card_equipped"
    }
}
