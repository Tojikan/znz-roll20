import * as abilities from './abilities.json';

export const fields = {
    notes: {
        id: "notes",
        type: "textarea"
    },
    ammo: {
        id: "ammo",
        type: "list",
        default: 0,
        options: {
            light: {
                id: "ammo_light",
                bundle: 30,
                label: "Light"
            },
            medium: {
                id: "ammo_medium",
                bundle: 30,
                label: "Medium"
            },
            heavy: {
                id: "ammo_heavy",
                bundle: 30,
                label: "Heavy"
            },
            bolt: {
                id: "ammo_bolt",
                bundle: 5,
                label: "Bolts"
            },
            arrow: {
                id: "ammo_arrow",
                bundle: 5,
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
            default: 15,
            type: "max",
            label: "AP",
            rollable: true,
            pool: 'ap_pool'
        },
    },
    combatskills: {
        id: "combatskills",
        type: "list",
        label: "Combat Skills",
        default: 3,
        options: {
            guard: {
                id: "guard_skill",
                label: "Guard"
            },
            throw: {
                id: "throw_skill",
                label: "Throw"
            },
            melee: {
                id: "melee_skill",
                label: "Melee"
            },
            ranged: {
                id: "ranged_skill",
                label: "Ranged"
            }
        }
    },
    skills: {
        id: "skills",
        type: "list",
        label: "Skills",
        default: 0,
        options: {
            lockpick: {
                id: "lockpick_skill",
                label: "Lockpick"
            },
            scout: {
                id: "scout_skill",
                label: "Scout"
            },
            stealth: {
                id: "stealth_skill",
                label: "Stealth"
            },
            social: {
                id: "social_skill",
                label: "Socialize"
            },
            firstaid: {
                id: "firstaid_skill",
                label: "First Aid"
            },
            construction: {
                id: "construction_skill",
                label: "Construction"
            },
            hacking: {
                id: "hacking_skill",
                label: "Hacking"
            },
            athletics: {
                id: "athletics_skill",
                label: "Athletics"
            }
        }
    },
    ability: {
        id: "ability",
        type: "toggleselect",
        options: abilities
    },
    // weaponslots: {
    //     id: "weaponslots",
    //     label: "Weapons",
    //     default: 1,
    //     max: 3,
    //     type: "weapon"
    // },
    equipmentslots: {
        id: "equipmentslots",
        default: 3,
        max: 10,
        type: "equipment",
        label: "Equipment"
    },
    inventory: {
        id: "inventory",
        default: 5,
        max: 9,
        label: "Inventory"
    }
}