export const fields = {
    notes: {
        id: "notes"
    },
    ammo: {
        id: "ammo",
        types: [
            "d4",
            "d6",
            "d8",
            "d10",
            "d12",
            "d20",
            "Bolt",
            "Arrow"
        ]
    },
    stats: {
        health: {
            id: "health",
            default: 30,
        },
        energy: {
            id: "energy",
            default: 40,
        },
    },
    dodge: {
        id: "dodge",
        default: 2,
    },
    armor: {
        id: "armor",
        default: 0
    },
    ability: {
        id: "ability"
    },
    slots: {
        weaponslots: {
            id: "weaponslots",
            default: 1,
            max: 4,
            prefix: "weapon",
            label: "Weapons"
        },
        equipmentslots: {
            id: "equipmentslots",
            default: 2,
            max: 5,
            prefix: "equipment",
            label: "Equipment"
        }
    },
    inventory: {
        id: "inventoryslots",
        default: 5,
        max: 9,
        prefix: "inventory",
        label: "Inventory"
    }
}