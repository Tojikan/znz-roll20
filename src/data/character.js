export const CharacterModel = {
    body: { 
        key: 'bodypool', 
        default: 15,
        tip: "Number of dice rolled on physical actions. Attributes below determine the target number to be considered a success",
        attr: {
            strength: { key: 'strength', tip:'Melee Attacks, Blocking', default:2},
            coordination: { key: 'coordination', tip:'Ranged Attacks, Dodging', default:2},
            instinct: { key: 'instinct', tip:'Scavenging, Reaction Time', default:2},
            endurance: { key: 'endurance', tip:'Resist Pain, Injuries and Sickness', default:2},
        }

    },
    mind: { 
        key: 'mindpool', 
        default: 15, 
        tip: "Number of dice rolled on mental actions. Attributes below determine the target number to be considered a success",
        attr: {
            intelligence: { key: 'intelligence', tip:'Knowledges, Learning', default:2},
            charisma: { key: 'charisma', tip:'Social Interaction, Insight', default:2},
            perception: { key: 'perception', tip: 'Scouting, Sensing the environment', default:2},
            tenacity: { key: 'tenacity', tip:'Resist Sanity Damage', default:2},
        }
    },
    health: { key: 'health', default: 150, max: true, tip:"Your character dies when this reaches 0. Lose 1 dice from your Body Pool per 10 health lost."},
    sanity: { key: 'sanity', default: 150, max: true, tip:"Your character goes insane when this reaches 0. Lose 1 dice from your Mind Pool per 10 sanity lost."},
    fatigue: { key: 'fatigue', tip:"Every point of fatigue increases the dice face used for all rolls by 1, reducing chances of success"},
    actions: { key: 'actions', max: true, action: 'refreshAP', actiontext: 'Refresh AP', tip:"Track the number of actions you've taken this turn"},
    ammo: {
        list: {
            light: {key: 'ammolight', label: 'Light'},
            medium: {key: 'ammomedium', label: 'Medium'},
            heavy: {key: 'ammoheavy', label: 'Heavy'}
        }
    },
    bonusrolls: {label: 'Bonus Rolls', key: 'bonusrolls', default: 0},
    rollcost: {label: 'Fatigue Cost', key: 'rollcost', default: 1},
}