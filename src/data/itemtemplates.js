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
    },
    handgun: {
        name: "Revolver",
        type: "ranged",
        category: 'Handgun',
        quantity: 1,
        melee: 1,
        ranged: 4,
        block: 1,
        durability: 2,
        ammo: 4,
        variations: {
            uncommon: {
                name: "9mm Pistol",
                durability: 4,
                ammo: 8,
            },
            rare: {
                name: "Desert Eagle",
                ranged: 8,
                durability: 6,
                ammo: 5
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
                quantity: 2,
                description: "Remove 5 fatigue. Regain 5 Sanity."
            },
            epic: {
                name: "Gourmet Hot Meal",
                quantity: 1,
                description: "Remove 15 fatigue. Regain 5 sanity. Regain 5 health."
            },
            legendary: {
                name: "Your Favorite Food.",
                quantity: 1,
                description: "Remove all fatigue or regain all sanity."
            }
        }
    },
    medicine: {
        name: "Bandages",
        type: "misc",
        category: 'Consumable',
        quantity: 2,
        description: "Regain 3 health.",
        variations: {
            uncommon: {
                name: "Pain Killers",
                quantity: 2,
                description: "Regain 5 health."
            },
            rare: {
                name: "First Aid Kit",
                quantity: 1,
                description: "Regain 15 health."
            },
            epic: {
                name: "Med Kit",
                quantity: 1,
                description: "Regain 25 health."
            },
            legendary: {
                name: "Trauma Pack",
                quantity: 1,
                description: "Regain 50 health."
            }
        }
    },
    alcohol: {
        name: "Warm Beer",
        type: "misc",
        category: 'Consumable',
        quantity: 1,
        description: "Regain 3 sanity.",
        variations: {
            uncommon: {
                name: "Wine",
                quantity: 5,
                description: "Regain 2 Sanity."
            },
            rare: {
                name: "Liquor",
                quantity: 12,
                description: "Regain 2 Sanity."
            },
            epic: {
                name: "Top Shelf Liquor",
                quantity: 10,
                description: "Regain 5 Sanity."
            },
            legendary: {
                name: "Drugs",
                quantity: 5,
                description: "Regain 10 sanity."
            }
        }
    },
    water: {
        name: "Water",
        type: "misc",
        category: 'Consumable',
        quantity: 3,
        description: "Use this in order to take a rest.",
    }
}