---
layout: page
title: Weapon Fields
hierarchy: child
---

## Weapon Fields ##

Attacks are determined based off a number of fields in the character sheet. Each weapon has various stats and values. This page provides details on those fields and what they mean.



### Hit Roll ###

The character sheet has a hit roll section for both Melee and Ranged. Hit rolls determine which dice to roll when making an attack. Note that all rolls start at D10 and that critical strikes occur on *10 or higher*. Having a higher hit roll effectively increases the chance of making a critical strike.


### Equipped Weapon Type ###

To make an attack, you must have a weapon equipped. Both Ranged and Melee weapons have a Type dropdown. This determines what type is used and, crucially, which weapon proficiency to consider when calculating an attack.


### Ammo ###

Ammo is the main resource when firing a ranged weapon. You must spend ammo to attack and you can only attack if you have sufficient ammo. The ammo has field has two numbers (current / max ). Beneath the Ammo field, there is a Reload field which determines how many times you can reload the weapon. When you reload the weapon, the weapon is refilled to max.


### Durability ###

Durability is a measure of a melee weapon's stat. It can be seen as the weapon's state of repair ( current / max ). Every time you roll a natural 1 on a melee attack, the durability drops by 1. If it drops to 0, the weapon can no longer be used unless repaired.

### Energy Cost ###

When making a melee attack, different weapons have different energy requirements. After all, swinging a heavy chainsaw is much more energy-intensive then stabbing with a knife. Each melee attack consumes energy and the Energy cost field determines how much energy.


### Damage ###

Both melee and ranged weapons have a damage field. Damage fields are straightforward - you type in the dice rolled when determining damage, such as 1d6 or 1d10+2.

You can enter a limited set of dice notation:

- The number of dice and the type (i.e. 1d10, 2d6, 3d4)
- The roll bonus (+1, +2, +3)
- A *Brutal* or roll minimum (>2, >3, >4) which states that the roll must be this value or higher.

A damage dice might look like

1d6
1d6+2 
1d6+2>3 (3 damage minimum)


### Crit Bonus ###

Crit bonus determines how many additional damage dice to add if your weapon crits (roll a natural 10 or higher). This bonus is *additive*. Meaning you roll the original damage dice and then roll an additional times equal to the bonus. Note that this doesn't apply to a roll bonus but only to the dice itself.

Example:

``` Regular damage is 1d6. The crit bonus is 1. The player rolls 1d6 one time in addition to the regular damage roll, so the final damage is 2d6```

``` Regular damage is 1d6. The crit bonus is 2. The player rolls 1d6 two times in addition to the regular roll, so the final damage is 3d6```

``` Regular damage is 1d6+2. The crit bonus is 2. The player rolls 1d6 two times, so the final damage is 3d6+2```


### Weapon Range ###

Ranged weapons have a weapon range. This consists of two numbers.

` 5 / 10 `

The first number is the **Effective Range**. If a player attacks a target within this number of squares, the attack is reliable to hit.

The second number is the **Max Range**. If a player attacks a target within this number of squares but outside of the Effective range, it is much harder to hit but still conceivable to *purposefully* hit the target.

If attacking from outside the Max Range, the attack is extremely unlikely and is very hard to hit.

Examples: Range of 5/10

``` Player is 4 spaces away from target. They are in effective range ```

``` Player is 7 spaces away from target. They are within the max range ```

``` Player is 12 spaces away from target. They are outside the max range ```


### Weapon Reach ###

Melee weapons have a weapon reach. This is a single number. This simply indicates how far away a player can make a melee attack.

A reach of 1 means they must be directly adjacent to a target.

A reach of 2 means they can be 1 space away from the target.



### Fields are Interchangeable ###

With the inventory, you'll notice that all items go in the same inventory and that you can switch the item type. Conceivably, you can turn a melee weapon into a ranged weapon and a ranged weapon to melee in the character sheet.

Functionally, this is the equivalent of A)Throwing a melee weapon at a target or B) Melee attacking with the butt of your ranaged weapon.

This is determined to be valid.