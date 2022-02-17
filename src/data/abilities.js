export default [
    {
        key: "sniper",
        label: "Sniper",
        levels: [
            {
                label: "Aimed Shot",
                tip: "Spend 1 action to gain 4 bonus rolls on your next ranged attack this turn.",
            },
            {
                label: "Enhanced Aimed Shot",
                tip: "Your Aimed shot now adds 6 bonus rolls. You can now accumulate 2 aimed shots in one turn to apply it to a ranged attack next turn as long as the attack is the first action you take.",
            },
            {
                label: "Critical Strike",
                tip: "Anytime you have 10 or more successes on a ranged attack, deal double damage."
            }

        ],
    },
    {
        key: "encyclopedia",
        label: "Encyclopedia",
        levels: [
            {
                label: "Memory",
                tip: "You can attempt simple skills that you do not have with a -4 roll penalty. You cannot gain bonus rolls for this attempt.",
            },
            {
                label: "Knowledge",
                tip: "Spend 5 sanity. Get a helpful tip from the ZM.",
            },
            {
                label: "Mastery",
                tip: "Gain double XP."
            }
        ],
    },
    {
        key: "cheerleader",
        label: "Cheerleader",
        levels: [
            {
                label: "Go Team Go!",
                tip: "Spend 1 action to give 2 bonus rolls to adjacent/nearby allies. Increase Fatigue by 10."
            },
            {
                label: "If you can't do it!",
                tip: "Spend 1 action to target 1 ally. They gain bonus rolls equal to your Charisma. Increase Fatigue by 5.",
            },
            {
                label: "Nobody can!",
                tip: "Bonus rolls persist through the end of combat. Rolls do not stack.",
            },
        ]
    },
    {
        key: "protector",
        label: "Protector",
        levels: [
            {
                label: "Stay Behind Me",
                tip: "You can take damage directed at adjacent or nearby allies."
            },
            {
                label: "Shield Bash",
                tip: "Excess block exceeding an attack can now be dealt as damage."
            },
            {
                label: "Turtle Mode",
                tip: "At the start of your turn, you can enter defensive mode. You take half damage but deal half damage."
            }
        ]
    },
    {
        key: "actionstar",
        label: "Action Star",
        levels: [
            {
                label: "Active Reload",
                tip: "You can now combine reloading and moving. Reloading no longer ends your attack phase (you can now attack right after reloading)."
            },
            {
                label: "Hit and Run",
                tip: "You can now combine moving and attacking as a single action with a -4 roll penalty."
            },
            {
                label: "Bullet Time",
                tip: "Gain 1 additional action. Gain 5 fatigue."
            }
        ]
    },
    {
        key: "therapist",
        label: "Therapist",
        levels: [
            {
                label: "Here to Listen",
                tip: "You can give your Sanity to others during a short rest. Restore 5 Sanity on Long Rests."
            },
            {
                label: "Emotional Intelligence",
                tip: "When you give Sanity, give twice as much as you lose."
            },
            {
                label: "Personal Conneciton",
                tip: "Anyone you give Sanity to gains 2 Bonus Rolls until the next short rest. This can only be active on one person at a time."
            }
        ]
    },
    {
        key: "brawler",
        label: "Brawler",
        levels: [
            {
                label: "Counterstrike",
                tip: "Fully dodging a melee attack allows you to make a free attack back."
            },
            {
                label: "Doublestrike",
                tip: "Gain +2 bonus rolls to your attacks if you melee attack for all of your main actions."
            },
            {
                label: "Dodgestrike",
                tip: "Gain 1 free dodge success for every melee attack success after 5 successes."
            }
        ]
    },
    {
        key: "lucky",
        label: "Lucky",
        levels: [
            {
                label: "Re-roll",
                tip: "Three times per game session, you can re-roll a roll. You must accept the results of the second roll and you do not regain any resources back."
            },
            {
                label: "Treasure Finder",
                tip: "When you scavenge, roll a luck check. If the result is high enough, you can scavenge again."
            },
            {
                label: "Dodging Death",
                tip: "Whenever your health is reduced below 0 next, be reduced to 1 hp instead. If feasible, you will be placed away from any immediate danger. This can only occur once. You can use this effect on other players."
            }
        ]
    },
    {
        key: "combatsense",
        label: "Combat Sense",
        levels: [
            {
                label: "Combat Sense",
                tip: "You can use an action at the start of each combat round to sense the lowest health target."
            },
            {
                label: "Attack Interpolation",
                tip: "Your Combat Sense action can also sense enemy intents, such as their targets for ranged attacks."
            },
            {
                label: "Tactician",
                tip: "At the start of combat, you can re-assign initiative rolls between players."
            }
        ]
    },
    {
        key: "martialartist",
        label: "Martial Artist",
        levels: [
            {
                label: "Disabling Strike",
                tip: "Your unarmed attack can lower the results of any rolls your target makes this turn, based on number of successes. Does not stack."
            },
            {
                label: "Weakening Strike",
                tip: "Your unarmed attack on a target allows other targets to gain bonus rolls when attacking that same target this turn, based on number of successes. Does not stack."
            },
            {
                label: "Lotus Strike",
                tip: "Your unarmed attack on a target can stun the target, preventing any further actions this turn, based on number of successes."
            }
        ]
    },
    {
        key: "leader",
        label: "Leader",
        levels: [
            {
                label: "Lead from the front",
                tip: "Adjacent allies take reduced damage equal to your Charisma attribute but cannot reduce an attack's damage below 3."
            },
            {
                label: "Inspire",
                tip: "Once per combat, you can spend 5 sanity and 1 action to make all nearby/adjacent players have free rolls for a turn."
            },
            {
                label: "Stick to the Plan",
                tip: "At the start of combat, you can declare a specific plan of action. Players who stick to this plan of action gain +2 bonus rolls."
            },
        ]
    },
    {
        key: "resources",
        label: "Conservationist",
        levels: [
            {
                label: "Power Naps",
                tip: "Once per session, you can restore resources during a short rest as if it was a long rest (2x effect on food and healing)."
            },
            {
                label: "Proper Maintenance",
                tip: "Once per session, you can increase the durability and max durability of an item by 5. This can only happen to 1 item at a time."
            },
            {
                label: "Efficient Actions",
                tip: "Reduce your base Fatigue Cost by 1."
            },
        ]
    },
    {
        key: "zmutationN",
        label: "N Mutation",
        levels: [
            {
                label: "N Mutation",
                tip: "You cannot gain or level this ability through normal means. You are no longer quite human. There is no longer any limit on your Strength, Agility, and Perception attributes and they cost half XP to increase. Skills cost double XP to increase. Unarmed attacks deal damage equal to your Strength attribute."
            },
            {
                label: "???",
                tip: "????"
            },
            {
                label: "???",
                tip: "????"
            }
        ]
    },
]