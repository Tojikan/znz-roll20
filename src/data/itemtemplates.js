export const meleeWeapons = {
    knife: {
        name: "Knife",
        type: "melee",
        category: "Knife",
        quantity: 1,
        melee: 6,
        ranged: 6,
        block: 2,
        durability: 4,
        variations: {
            uncommon: {
                name: "Hunting Knife",
                melee: 7,
                ranged: 7,
                durability: 8,
            },
            rare: {
                name: "Bowie Knife",
                melee: 10,
                ranged: 10,
                durability: 12,
                block: 3,
            },
            epic: {
                name: "Ka-Bar",
                melee: 12,
                ranged: 12,
                durability: 16,
                block: 5,
            },
            legendary: {
                name: "WASP Injection Knife",
                melee: 30,
                durability: 10,
            }
        }
    },

    club: {
        name: "Club",
        type: "melee",
        category: 'Club',
        quantity: 1,
        melee: 3,
        ranged: 3,
        block: 3,
        durability: 8,
        variations: {
            uncommon: {
                name: "Baseball Bat",
                melee: 5,
                durability: 15,
                block: 5,
            },
            rare: {
                name: "Baton",
                melee: 8,
                durability: 25,
                block: 8,
            },
            epic: {
                name: "Morning Star",
                melee: 12,
                durability: 40,
                block: 10,
            },
            legendary: {
                name: "Kanabo",
                melee: 18,
                ranged: 5,
                durability: 60,
                block: 15
            }
        }
    }
}

//TODO: alias
export const miscItems = {
    food: {
        name: "Snacks",
        type: "misc",
        category: 'Food',
        quantity: 3,
        description: "Remove 3 fatigue",
        variations: {
            uncommon: {
                name: "Meal",
                quantity: 1,
                description: "Remove 10 fatigue"
            },
            rare: {
                name: "Junk Food",
                quantity: 1,
                description: "Remove 5 fatigue. Regain 5 Sanity."
            },
            epic: {
                name: "Meal",
                quantity: 1,
                description: "Remove 10 fatigue"
            }
        }
    }
}