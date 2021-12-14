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
        body: { default: 10, tooltip: 'This is the number of dice rolled when making actions that involve physical activity. Skills below are used to set a roll target' },
        mind: { default: 10, tooltip: 'This is the number of dice rolled when making actions that involve mental activity. Skills below are used to set a roll target' },
        spirit: { default: 10, tooltip: 'This is the number of dice rolled when making supportive actions that involve your senses, emotions, creativity, or will to live. Skills below are used to set a roll target' },
        skills: {
            list: {
                melee: { uses: 'body', label: 'Melee Combat'},
                blocking: { uses: 'body' },
                dodging: { uses: 'body' },
                ranged: { uses: 'body', label: 'Ranged Combat' },
                throwing: { uses: 'body' },
                athletics: { uses: 'body' , tooltip: 'Ability to do movements such as climbing, swimming, parkour etc.'},
                endurance: { uses: 'body' , tooltip: 'Resist sickness or health conditions or injuries.'},
                stealth: { uses: 'body' },
                
                memory: { uses: 'mind', tooltip: 'Ability to learn and also remember random trivia. '  },
                sociology: { uses: 'mind', tooltip: 'Understanding of how people and society works.'},
                engineering: { uses: 'mind', tooltip: 'Understanding of engineering concepts, make and repair machinery, etc.' },
                science: { uses: 'mind' , tooltip: 'Understanding of scientific theories, such as physics, chemistry, biology, etc.' },
                medicine: { uses: 'mind', tooltip: 'Used for curing sickness, applying first aid, healing wounds, etc.'  },
                investigation: { uses: 'mind'},
                nature: { uses: 'mind', tooltip: 'Understanding of nature, wildlife, plants, weather, etc.'  },
                thievery: { uses: 'mind', tooltip: 'Used for hacking, lockpicking, stealing, hotwiring etc. '  },
                
                crafting: { uses: 'spirit'},
                perception: { uses: 'spirit'},
                reflexes: { uses: 'spirit', tooltip: 'React to events. Also used to add bonus to initiative.'  },
                tenacity: { uses: 'spirit', tooltip: 'Resist mental trauma and endure pain.'  },
                socialskills: {uses: 'spirit', label: 'Social Skills', tooltip: 'Used for interacting with other people - persuasion, negotiation, intimidation'},
                emotions: {uses: 'spirit', tooltip: 'Used for empathizing with others, getting others to trust you, and reducing your trauma.' },
                insight: {uses: 'spirit', tooltip: 'Be able to ascertain or understand the intentions of others.' },
                luck: { uses: 'spirit', tooltip: 'Improves any rolls that are pure random chance.'  }
            }
        },
        equipmentslots: {
            default: 2,
            max: 6
        },
        inventoryslots: {
            default: 5,
            max: 12
        }
    }
);
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
// }