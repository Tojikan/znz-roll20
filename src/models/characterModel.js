import { Model } from "./classes/model";

export const CharacterModel = new Model(
    {
        health: {
            default: 100,
            max: true
        },
        fatigue: {
            affects: 'rolls'
        },
        trauma: {
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
            list: {
                ammolight: {label: 'Light'},
                ammomedium: {label: 'Medium'},
                ammoheavy: {label: 'Heavy'}
            }
        },
        body: { default: 10 },
        mind: { default: 10 },
        spirit: { default: 10 },
        skills: {
            list: {
                melee: { uses: 'body', label: 'Melee Combat'},
                blocking: { uses: 'body' },
                dodging: { uses: 'body' },
                ranged: { uses: 'body', label: 'Ranged Combat' },
                throwing: { uses: 'body' },
                athletics: { uses: 'body' },
                endurance: { uses: 'body' },
                stealth: { uses: 'body' },
                
                crafting: { uses: 'mind' },
                learning: { uses: 'mind' },
                vehicles: { uses: 'mind' },
                engineering: { uses: 'mind' },
                science: { uses: 'mind' },
                medicine: { uses: 'mind' },
                investigation: { uses: 'mind' },
                nature: { uses: 'mind' },
                
                scouting: { uses: 'spirit' },
                reflexes: { uses: 'spirit' },
                tenacity: { uses: 'spirit' },
                socialskills: {uses: 'spirit', label: 'Social Skills'},
                thievery: { uses: 'spirit' },
                emotions: {uses: 'spirit'},
                insight: {uses: 'spirit'},
                survival: { uses: 'spirit' }
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