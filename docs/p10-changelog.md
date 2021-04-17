---
layout: page
title: Changelog
---


## Change Log ##



# V3.0 Release #

Official release of ZnZ3.0, switching from ZnZ2.0

**Dice Pool System**
- Introducing the Dice Pool system, players now roll a number of dice based on a character's skill/proficiency with the action they are attempting. All the dice rolls are tallied up to determine to final result. Players usually can add their Attribute modifiers to each dice roll.
- Skills/Proficiencies no longer give bonus, but now indicate the max amount of dice a player can roll for a given action. Players *do not* have to roll the max amount.
- All proficiencies start at 1. All skills start at 0 - which means you can't make any roll unless you have training in the skill.
- Attribute only rolls (such as strength or perception checks) determine their pool based on their Attribute Score / 2.
- Critical Successes (natural 10s) now add 1 free roll to the action's dice pool. This does not stack (non-exploding).
- Critical Failures (natural 1s) adds a negative roll to the dice pool, subtracting the final result of the roll.

**Resource System**
- For active actions (not a passive check), players consume 1 resource (Energy, Sanity, Health, Durability or Ammo) per dice roll they choose to make. 
- Passive actions do not require resource, instead players roll the max amount of dice.
- Players now have to consume water. 
    - Players still use consumables to restore Energy and Sanity. However, players **cannot** restore Energy, Sanity, or Health without consuming 1 unit of water.
- Periodically throughout the day, the ZM can charge players energy/sanity based on what players are doing (i.e. walking for several miles consumes energy)
- Players need to eat/drink something everyday or else suffer a negative side effect.
- Basic Food and medicine both restore only 3 points of energy and health respectively.


**Attacks and Armor**
- When making an attack, players add up the full sum of the roll. The sum of this is divided by a character's **Armor Rating**. The resulting quotient of that calculation is the amount of attacks that succeed. 
- Player can then roll 1 weapon damage per successful attack..
- There are now 4 categories of armor - Head, Body, Arms, Legs

**Abilities**
- Abilities now have level progression. Players can train an ability again to raise its level. As the level raises, it becomes more powerful and unlocks more effects.

**Movement Speed**
- Movement speed is now determined the the Athletics attribute.

**Hygiene**
- Hygiene tracks your character's general health. Everytime you do something that may compromise health, you will lose Hygiene. If it gets low enough, your character becomes sick.

**Counters**
- Rather than track all items individually, you can place broad category of items in the Inventory Counter section.

**Ammo**
- Ammo is tracked into categories instead of by weapon.

**New Scripts**
- New API Scripts
    - Reworked Reload
    - Z-Roll for rolling system.
    - Damage for damage rolling
    - Reworked Item Pickup script.

**New Sheet Features**
- Tabs
- More Rollable Buttons. 
- Automatic dropdown population for Z-Roll button queries.
- Export button for inventory items for use on pickup script.