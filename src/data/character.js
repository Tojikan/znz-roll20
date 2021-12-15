export const Character = {
    model: {
        body: { key: 'bodypool', default: 15},
        mind: { key: 'mindpool', default: 15},
        health: { key: 'health', default: 150, max: true, tip:"Your character dies when this reaches 0. Lose 1 dice from your Body Pool per 10 health lost."},
        sanity: { key: 'sanity', default: 150, max: true, tip:"Your character goes insane when this reaches 0. Lose 1 dice from your Mind Pool per 10 sanity lost."},
        fatigue: { key: 'fatigue', tip:"Measure of exhaustion - each point of fatigue increases the dice face used for all rolls by 1, reducing chance of success"},
        actions: { key: 'actions', max: true, action: 'refreshAP', actiontext: 'Refresh AP', tip:"Track the number of actions you've taken this turn"},
        ammo: {
            list: {
                light: {key: 'ammolight', label: 'Light'},
                medium: {key: 'ammomedium', label: 'Medium'},
                heavy: {key: 'ammoheavy', label: 'Heavy'}
            }
        },
        bonusrolls: {label: 'Bonus Rolls', key: 'bonusrolls', default: 0},
        rollcost: {label: 'Fatigue Cost', key: 'rollcost', default: 1}
    }
}