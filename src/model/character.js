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
                label: "Light",
                fulllabel: "Light Ammo"
            },
            medium: {
                id: "ammo_medium",
                bundle: 30,
                label: "Medium",
                fulllabel: "Medium Ammo"
            },
            heavy: {
                id: "ammo_heavy",
                bundle: 30,
                label: "Heavy",
                fulllabel: "Heavy Ammo"
            },
            arrow: {
                id: "ammo_arrow",
                bundle: 5,
                label: "Arrows",
                fulllabel: "Arrows"
            }
        }
    },
    stats: {
        health: {
            id: "health",
            default: 30,
            type: "max",
            label: "Health"
        },
        stamina: {
            id: "stamina",
            default: 10,
            type: "max",
            label: "Stamina"
        },
        ap: {
            id: "ap",
            default: 3,
            type: "max",
            label: "AP"
        },
        fatigue: {
            id: "fatigue",
            default: 0,
            label: "Fatigue"
        }
    },
    rolloptions: {
        cost: {
            id: 'rollcost',
        },
        difficulty: {
            id: 'rolldifficulty'
        }

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
            blunt: {
                id: "blunt_melee_skill",
                label: "Blunt Melee"
            },
            firearm: {
                id: "firearm_skill",
                label: "Firearm"
            },
            sharp: {
                id: "sharp_melee_skill",
                label: "Sharp Melee"
            },
            unarmed: {
                id: "unarmed_melee_skill",
                label: "Unarmed"
            },
            projectile: {
                id: "projectile_skill",
                label: "Projectile"
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
    equipmentslots: {
        id: "equipmentslots",
        default: 2,
        max: 6,
        type: "equipment",
        label: "Equipment"
    },
    inventory: {
        id: "inventory",
        default: 5,
        max: 12,
        label: "Inventory"
    },
    actions: {
        resetap: {
            id:'resetAp',
            label: "Reset AP"
        },
        resetfatigue: {
            id:'resetFatigue',
            label: "Reset Fatigue"
        },
        move: {
            id:'moveSpaces',
            label: "Calculate Run"
        }
    }

}