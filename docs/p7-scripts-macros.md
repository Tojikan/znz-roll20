---
layout: page
title: Scripts & Macros
---


## Scripts & Macros ##

ZnZ is designed to run off Roll20 and thus relies on a series of scripts and macros to automate most of the repetitive tasks to run the gameplay.

The Game Owner in Roll20 can create macros for everyone to use, which can appear as buttons on the bottom of the screen or when a character is selected.



### Initiative Macro ###

This is a common macro that is useful in any Roll20 game that uses the turn tracker. Simply *select your token* and then enter:

`/roll d10 @{selected}  &{tracker}`

to do an initiative roll for ZnZ and add it to the turn tracker. You can add this as a macro so it happens with the click of a button.

<br/><br/>

### Reload Script ###

In ZnZ, you need to reload your ranged weapon by subtracting a reload and filling up your ammo. You can automate this by typing or adding as a macro:

`!!reload`

<br/><br/>

### Stat Change Script ###

ZnZ often involves several changes to your Stats (Health, Energy, Sanity, XP). To keep track of this and make sure you're putting the right amount, a script automatically logs any changes into the game chat. No commands are necessary for this.

<br/><br/>


### Attack Script ###

Attacks in ZnZ requires several rolls and arithmetic. To automate the process, a robust Attack Script can be called in chat by typing

`!!attack`

You must also specify if this is a ranged or melee attack. You can do this in several ways.

`!!attack type=ranged`
`!!attack type=melee`
`!!attackranged`
`!!attackmelee`

There are additional parameters you can add to this command to customize your attack. See the [attack script]]({{site.baseurl}}/p7a-attack-script.html) page for more details.

<br/><br/>


### Pickup Script ###

Items have several fields and it can be a pain to pick them up. Luckily, there's a script that allows you to quickly pick up pre-made items. This is a more complicated script so definitely refer to  [pickup script]({{site.baseurl}}/p7a-pickup-script.html)

