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

A number of parameters can be added to the command to modify the attack. Parameters look like

`attacks=5`

The left side of the parameter is the parameter name and the right side is the value. In this case, this sets the number of attacks to 5.

There cannot be spaces in between the parameter, the equal signs, or the value. The script interprets inputs based on spaces so all parameters must not have a space.


### Available Parameters ###

| Parameter  | Description |
|----------  | ----------------------------- | 
| attacks    | Number of attacks to make.  |
| difficulty | Difficulty of the attack. This value can be 0, 1, 2, 3, or 4 |
| type       | Specified melee or ranged. You can also add melee/ranged directly to the '!!attack' as a shorthand. |
| reversed   | If this is set to 'true', you will melee with your ranged weapon or throw your melee weapon. Make sure the weapon at least as the melee/ranged damage field set prior to doing this |
| unarmed    | If the attack type is set to melee, you can add an 'unarmed=true' flag to do an unarmed attack instead of a melee attack. |



### The Attack ###

The script will calculate the results of the attack and output it into the chat.

Any resources used will be subtracted. 

If your weapon breaks or you run out of resources, the attack is halted.
