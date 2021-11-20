import { capitalize } from "lodash";

export const fields = {
    notes: {},
    ammo: {
        list: {
            light:{},
            medium:{},
            heavy:{},
            arrow:{}
        }
    },
    health: {},
    fatigue: {},
    actions: {},
    equipmentslots: {
        default: 2,
        max: 6
    },
    inventoryslots: {
        default: 5,
        max: 12
    },
    ability: {
        options: {
            _default: {
                label: "Select an ability"
            },
            scavenger: {
                description: "Draw 1 additional cards when you scavenge. If you are scavenging a location alone, draw 3."
            },
            sniper: {
                description: "Take aim - don't take any actions this turn. Roll them as free ranged attack actions next turn. You lose these free attacks if you do any action other than ranged attack prior to using them."
            }
        }
    },
    combatskills: {
        list: {
            guard: {
                label: "Guard"
            },
            throw: {
                label: "Throw"
            },
            blunt: {
                label: "Blunt Melee"
            },
            firearm: {
                label: "Firearm"
            },
            sharp: {
                label: "Sharp Melee"
            },
            unarmed: {
                label: "Unarmed"
            },
            projectile: {
                label: "Projectile"
            }
        }
    },
    skills: {
        options: {
            lockpick: {
                label: "Lockpick"
            },
            scout: {
                label: "Scout"
            },
            stealth: {
                label: "Stealth"
            },
            social: {
                label: "Social"
            },
            firstaid: {
                label: "First Aid"
            },
            construction: {
                label: "Construction"
            },
            hacking: {
                label: "Hacking"
            },
            athletics: {
                label: "Athletics"
            }
        }
    }
}


// Export our field data as a simple JSON object
export const fieldsData = ((function(){
    let keys = Object.keys(fields);
    let retVal = {};

    // Set ID and Label
    const setupField = function(key, obj){
        if (!'id' in obj){
            obj.id = key;
        }

        if (!'label' in obj){
            obj.label = capitalize(k);
        }

        return obj;
    }

    for (let k of keys){
        let obj = fields[k];

        obj.id = k;

        setupField(k, obj);

        //Set up options
        if ('options' in obj){
            for (let opt of Object.keys(obj.options)){\
                //add a prefix to the option id
                obj.options[obj] = setupField(`${k}_${opt}`, obj.options[opt]);
            }
        }

        retVal[k] = JSON.stringify(obj);
    }

    return retVal;

}))();