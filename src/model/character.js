import * as abilities from './abilities.json';

export const fields = {
    notes: {
        id: "notes",
        type: "textarea"
    },
    ammo: {
        id: "ammo",
        type: "list",
        options: {
            d4: {
                id: "ammo_d4",
                default: 0,
                label: "d4"
            },
            d6: {
                id: "ammo_d6",
                default: 0,
                label: "d6"
            },
            d8: {
                id: "ammo_d8",
                default: 0,
                label: "d8"
            },
            d10: {
                id: "ammo_d10",
                default: 0,
                label: "d10"
            },
            d12: {
                id: "ammo_d12",
                default: 0,
                label: "d12"
            },
            d20: {
                id: "ammo_d20",
                default: 0,
                label: "d20"
            },
            bolt: {
                id: "ammo_bolt",
                default: 0,
                label: "Bolts"
            },
            arrow: {
                id: "ammo_arrow",
                default: 0,
                label: "Arrows"
            }
        }
    },
    stats: {
        hp: {
            id: "hp",
            default: 30,
            type: "max",
            label: "HP"
        },
        ap: {
            id: "ap",
            default: 5,
            type: "max",
            label: "AP"
        },
    },
    defense: {
        id: "defense",
        default: 4,
        type: "dice",
        bonus: {
            id: 'defense_bonus',
            default: 0
        }
    },
    ability: {
        id: "ability",
        type: "toggleselect",
        options: abilities
    },
    weaponslots: {
        id: "weaponslots",
        label: "Weapons",
        default: 1,
        max: 3,
        type: "weapon",
        type: "variableslots"
    },
    equipmentslots: {
        id: "equipmentslots",
        default: 3,
        max: 5,
        type: "equipment",
        label: "Equipment",
        type: "slots"
    },
    inventory: {
        id: "inventory",
        default: 5,
        max: 9,
        label: "Inventory"
    }
}