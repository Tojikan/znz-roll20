---
layout: page
title: Changelog
---


# Roll System & Resources #

This game is built around dice rolling to resolve the results of actions. Dice rolls are handled through a *resource-limited Dice Pool* system.


## Rolling Dice ##

Players roll multiple dice per action. The maximum number of dice they roll is determined by a Skill/Proficiency or Attribute. *Players may choose to roll any number of dice up until this maximum - players do not always have to roll the full maximum*. The dice they roll are then summed to give a number. The ZM looks at this number to determine how successful an action is.

`Player tries to shoot with their gun. Their Firearm proficiency is 5. They can roll up to 5 dice or less for their attack. They choose to roll 5 and roll 3 + 5 + 2 + 8 + 7. Their roll total is 25.`.

Depending on the action, players can also add an attribute modifier to their action. When doing so, the modifier is added to each of the rolls.

`Player tries to listen to a door to determine if they can hear anything behind it, which uses the Scouting proficiency uses a character's Perception. Their Scouting proficiency is 3 and and their Perception modifier is +1. They roll 4 + 6 + 9. They can add their perception to each roll so it'll be 4(+1) + 6(+1) + 9(+1) which is a total of 22`.



### Critical Hits and Fails ###

If a player rolls a natural 10 with their dice, they have have a **Critical Hit**. Players can add a free dice roll to the end result. 

`Players rolls 3 dice for their melee attack. They roll a 2 + 3 + 10. Because they rolled a 10, they add an additional roll for free so it becomes 2 + 3 + (10 + 5).`

`Player rolls a 10 and then rolls a 10 for the Critical Hit Bonus (10 + 10). They do not roll a third time since the second 10 was a Critical Hit.`

If a player rolls a natural 1 with their dice, they have a **Critical Fail**. Player do not add the 1 to the end result and instead subtract an additional dice roll. This additional dice roll should always be at least 5 or higher. 

`Player rolls 4 dice to climb a wall. They roll a 4 + 2 + 5 + 1. Because they rolled a 1, the 1 is not added and an additional roll is made which is then subtracted from the result. The end result is 4 + 2 + 5 - (8) for a total 3`.

For both Critical Hits and Fails, the additional dice roll only happens once and does not stack on itself. This means if the player rolls a critical hit or fail on the bonus roll, they do not roll again.

`Player rolls a 1 and rolls a 1 for the Critical Hit Bonus (10 + 10). They do not roll a third time.`


### Active vs Passive roll ###

The reason a player may choose not to roll the full maximum number of dice is that each dice roll may have a cost. This depends on the nature of the roll:

**Active Rolls** are for when the character is actively attempting an action. This is an action that will typically affect the character or the environment around them. *Each dice roll in an active roll has a resource cost* (see section below for more information on resources). Therefore players must utilize their limited pool of resources for each dice roll. Players must carefully decide when the situation calls for resource expenditure or when they want to conserve.

`Player is attempting to escape a horde of zombies by climbing a wall. They have a Climbing proficiency of 5 and Climbing uses energy. They choose to roll 3 times, therefore spending 3 energy to roll 3 dice for the climb action.`


**Passive Rolls** are for when the character attempts something without trying or knowing whether they are capable of something. In passive rolls, there is no resource cost. Players generally just roll the maximum number of dice. This is typically used for inconsequential actions or running basic skill checks, at the ZM's disgression.

`Player walks into a room. The ZM may ask the player to roll a Passive Perception to determine what the player notices without trying. Player has a Perception roll of 2, so they roll 2 dice to see how much they notice`. 



## Resources ##

In ZnZ, players are attempting to survive in a harsh environment under severe conditiosn of scarcity. To simulate this, players have a pool of resources which they use to make actions. Players must properly manage their resources and include them into their considerations when deciding upon a course of action. Do they enter a risky building to try to secure a supply of food and water and ammunition? Do they avoid a conflict in order to conserve meager resources on their way to a destination? Players must factor in their remaining resources and decide accordingly.

Every roll made in the Dice Pool for an active roll will have a resource cost. Typically the cost per dice is 1.


### Character Resources ###

All characters have inherent resource traits - Energy, Sanity, and Health.


#### Energy ####

Energy is a measure of a character's physical stamina. This is used for any physical actions, such as melee attacking, climbing, or swimming. If a character reaches 0 energy, all of their physical actions will fail, movement speed is reduced by half, and they begin to take damage.

Energy can be restored by consuming food.


#### Sanity ####

Sanity is a measure of a character's mental state. This is used for any mental activities, such as hacking a computer, attempting to listen at a door, or trying to persuade a strange. If a character reaches 0 sanity, all of their mental actions will fail, their actions will be randomized into a [Stress Response]({{site.baseurl}}/p4-combat.html), and they may gain a new character flaw.

Sanity can be restored by consuming alcohol, through environmental means, or through an ability.


#### Health ####

Health is a measure of the character's state and how much damage they've taken. Once a player hits 0 health, they will die. This is not a typical resource in that it is not usually used for rolls but must be considered carefully.

Health can be restored via medicine, healthkits, or other medical items.


### Equipment Resources ###

Ranged and Melee weapons also have limited resources.


#### Ammo ####

Ranged weapons consume ammo for every dice roll when attacking. In addition, weapons must can only hold a certain amount of ammo at a time and if empty, must be reloaded prior to firing. For simplicity sake, ammo is organized into several categories:

{% for ammo in site.data.ammoTypes %}
- {{ammo.name}}
{% endfor %}

Each weapon will have a set type of ammo. Each character has a section on their sheet for tracking how much ammo they have of that category.

Ammo can only be regained through scavenging or crafting.


#### Durability ####

Mlee weapons consume durability for every dice roll when attacking. When a melee weapon runs out of durability, it breaks and can no longer be used. Durability is tracked individually for each melee weapon.

Durability can be restored through reparing the weapon.

