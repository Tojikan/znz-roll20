---
layout: page
title: Attack Script
hierarchy: child
---

## Attack Script ##


Attacks in ZnZ requires several rolls and lots of arithmetic. To automate the process, a robust Attack Script can be called in chat by typing

`!!attack`

You must also specify if this is a ranged or melee attack. You can do this in several ways.

`!!attack type=ranged`

`!!attack type=melee`

`!!attackranged`

`!!attackmelee`


### Parameters ###



### Parameters ###
A number of parameters can be added to the command to modify the attack. Parameters look like

`attacks=5`

The left side of the parameter is the parameter name and the right side is the value. In this case, this sets the number of attacks to 5. There cannot be spaces in between the parameter, the equal signs, or the value. The script interprets inputs based on spaces so all parameters must not have a space.

| Parameter  | Description |
|----------  | ----------------------------- | 
| attacks    | Number of attacks to make.  |
| difficulty | Difficulty of the attack. This value can be 0, 1, 2, 3, or 4 |
| type       | Specified melee or ranged. You can also add melee/ranged directly to the '!!attack' as a shorthand (!!attackranged or !!attackmelee). |
| hitbonus   | Adds a flat value to the result of the hit roll without affecting chance to crit |
| critbonus  | Adds a flat value to the hit dice, increasing chance to crit |
| damagebonus| Adds a flat value to each successful attack's damage roll |


### Flags ###
Flags apply special settings to your attack if added to the command. Flags are applied by prepending '--' to the front of the command

`--unarmed`

Causes the unarmed flag to be set. Alternatively, you can set the same flag using parameter notation 

`unarmed=true`

| Flag       | Description |
|----------  | ----------------------------- | 
| unarmed    | Turns your attack into an unarmed strike without using any weapon fields.  |
| alt        | Makes an alternative attack - melee with your ranged weapon or throw your melee weapon. Item must have the appropriate fields filled. |
| snipe      | If applied on a ranged attack, adds a value onto the hitbonus/critbonus of your attack. |
| kungfu     | If applied on a melee unarmed attack, adds Strength modifier to your unarmed damage roll. |



### The Attack ###

The script will calculate the results of the attack and output it into the chat.

Any resources used will be subtracted. 

If your weapon breaks or you run out of resources, the attack is halted.
