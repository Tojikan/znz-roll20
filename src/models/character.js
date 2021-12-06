// import { capitalize } from "lodash";
import { Model } from "./classes/model";


export const Character = new Model(
    {
        health: {
            default: 100,
            max: true
        },
        fatigue: {
            affects: 'rolls'
        },
        sanity: {
            affects: 'success'
        },
        actions: {
            max: true,
            default: 3,
            action: 'refreshAP',
            actionlabel: 'refresh'
        },
        rollmod: {},
        rollcost: {},
        ammo: {
            types: {
                light: {
                    id: 'ammo_light'
                },
                medium: {
                    id: 'ammo_medium'
                },
                heavy: {
                    id: 'ammo_heavy'
                }
            }
        }
    }
);

// export const CharacterModel = {
    // notes: {},
    // ammo: {
    //     type: 'list',
    //     list: {
    //         light:{},
    //         medium:{},
    //         heavy:{},
    //         arrow:{}
    //     }
    // },
    // health: {
    //     type: 'max'
    // },
    // fatigue: {
    //     type: 'max'
    // },
    // actions: {
    //     type: 'max'
    // },
    // equipmentslots: {
    //     default: 2,
    //     max: 6
    // },
    // inventoryslots: {
    //     default: 5,
    //     max: 12
    // },
    // ability: {
    //     options: {
    //         _default: {
    //             label: "Select an ability"
    //         },
    //         scavenger: {
    //             description: "Draw 1 additional cards when you scavenge. If you are scavenging a location alone, draw 3."
    //         },
    //         sniper: {
    //             description: "Take aim - don't take any actions this turn. Roll them as free ranged attack actions next turn. You lose these free attacks if you do any action other than ranged attack prior to using them."
    //         }
    //     }
    // },
    // combatskills: {
    //     type:'list',
    //     list: {
    //         guard: {
    //             label: "Guard"
    //         },
    //         throw: {
    //             label: "Throw"
    //         },
    //         blunt: {
    //             label: "Blunt Melee"
    //         },
    //         firearm: {
    //             label: "Firearm"
    //         },
    //         sharp: {
    //             label: "Sharp Melee"
    //         },
    //         unarmed: {
    //             label: "Unarmed"
    //         },
    //         projectile: {
    //             label: "Projectile"
    //         }
    //     }
    // },
    // skills: {
    //     type: 'list',
    //     list: {
    //         lockpick: {
    //             label: "Lockpick"
    //         },
    //         scout: {
    //             label: "Scout"
    //         },
    //         stealth: {
    //             label: "Stealth"
    //         },
    //         social: {
    //             label: "Social"
    //         },
    //         firstaid: {
    //             label: "First Aid"
    //         },
    //         construction: {
    //             label: "Construction"
    //         },
    //         hacking: {
    //             label: "Hacking"
    //         },
    //         athletics: {
    //             label: "Athletics"
    //         }
    //     }
    // }
// }