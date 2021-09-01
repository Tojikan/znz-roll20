---
layout: page
title: Commands
---

# Script Commands #


Additional commands are built with the game.

<br/>

## Zroll ##

ZRoll is the API script powering rolling. Use:

`!!zroll`

to use it.

Type in `!!zroll help` to get a list of available commands.


## Reload ##

Select a token and use ``!!reload`` to automatically reload the character's ranged weapon.

## Damage Roll ##

Handles the calculation of data. Use `!!damage help` for more info.


## Pickup Script ##

Pickup script allows you to type in a command that automatically adds an item to your characters inventory. Select your token and type in: 

`!!pickup`

in the chat. You then add parameters to set the properties of the item. Example:

`!!pickup name='This is my new item' weight=5 note="Look and despair!" type='melee_weapon'`


The following parameters are available

- name
- type
- weight
- quantity
- note
- armor
- damage
- range
- uses
- max
- ammo


You can also specify an existing item templates, which are premade items already added to the system. Add a template through the `item` parameter.

`!!pickup item=blunt1`

Note that you can override any property of the item template such as the following:

`!!pickup item=sharp1 name='Stabby McStabFace'`

Available item templates are:

{% for item in site.data.itemtemplates-weapons -%}
    - {{item[0]}}
{% endfor %}
{% for item in site.data.itemtemplates-armor -%}
    - {{item[0]}}
{% endfor %}
{% for item in site.data.itemtemplates-misc -%}
    - {{item[0]}}
{% endfor %}


<br/>

## Actions ##

On a character's turn, they can take **2 Actions**. Available actions include:

- **Attacking** with either their Ranged or Melee weapon, or Unarmed. See the attacking section for more info.
- **Moving** their move speed to a target location. Traversing an obstacle, such as a barricade, may incur a penalty on their move speed, up to requiring an entire action based on the difficulty of the obstacle.
- **Reloading** a ranged weapon.
- **Equipping** a new weapon from the inventory.
- **Dodging** an incoming attack. The character readies themselves, which allows them to dodge 1 incoming attack until their next turn. A dodge requires players to roll a Dexterity active roll to see if they dodge an attack. See Dodging section below.
- **Grappling** with an Infected that is grabbing them. The character tries to break from a grab by rolling an active Strength roll to see if they remain grabbed or break free.
- Recovering from a knockback or prone position. See Grappling section below.
- Use a character or equipment ability.
- Make a reaction trigger for a specific event occurring.
- Interacting with the environment.


Once a player completes an action, they cannot repeat it that turn **unless** they spend an additional **2 energy**. By spending 2 energy, they can repeat the action, allowing them to move twice, attack twice, etc.

If you have an action remaining at the end of your turn, you will automatically take a Dodge action unless specified.

### Free Actions ###

Players can make a free action (within reason) on their turn, such as shouting or saying something or attempting to notice something.

<br/><br/>


## Attacking ##

Players can make a ranged, melee, or unarmed attack. When attacking, players specify the number of times they will roll dice, up to their proficiency level in the type of attack. Each roll will cost a resource.

- Each Ranged attack roll will typically cost 1 ammo. If the ranged weapon runs out of ammo, they cannot attack.
- Each Melee attack roll will typically cost 1 weapon durability and 1 energy.


This dice are added up to determine a final **Attack Sum**.

`Player decides to roll 4 dice for their ranged attack. They subtract 4 ammo from their weapon, and then roll 4 dice (8 + 7 + 3 +2) for a total attack sum of 19.`

<br/>

### Dodging ###

At the same time, if the target of an attack took a Dodge action on their last turn, the target can roll a **Dodge Roll** which will be a Dexterity active roll. If the dodge roll exceeds the attack sum, then the attack fails. 

Ideally, neither dodger nor attacker should know what the other side roll. The ZM should make effort to prevent players from knowing how much their attacker or their target rolled on their Attack/Dodge rolls.

Common Infected do not dodge.

`An Infected rolls a total of 12 against a player. The player used 3 energy for their Dodge Action with a +1 Dexterity modifier. The roll was (5 + 7 + 2) plus an additional +1 modifier for each roll for a total of 17. The player avoids the attack as they rolled 17 against 12`

<br/>

### Armor Rating ###

Each character will have an armor rating, which is a number based on the defenses of the character, such as any clothing or protection they are wearing. This armor rating is used to determine the number of hits a successful attack makes. Having a higher armor rating, therefore, lowers damage.

This is calculated by **dividing the Attack Sum by the Armor Rating**. The resulting quotient is the **number of successful hits** (any remainder is ignored and rounded down). Then, for each successful hit, the attacker can roll their **Weapon Damage** with a **Damage Roll**. The damage rolls are summed up to determine the final amount of damage dealt to the target.

`A player rolls a total attack roll of 26 against an Infected with an Armor Rating of 6. 26 divided by 6 is 4 after rounding down to the nearest whole number. The player then gets to roll their Weapon Damage 4 times. Their weapon damage is 4, so 4x4=16. The player deals 16 damage against the Infected.`

Armor rating can often be increased due to environmental effects or if an attack is out of range. If the Armor Rating exceeds the entire Attack Sum, the target does not receive any damage. *However, there is an exception for Infected attacks, which will always have at least 1 successful hit*. See the Fighting the Infected section for more info. 

<br/>


### Damage ###

Each weapon will list a number or a range of numbers. This is the amount of damage the weapon can deal per successful hit. With each successful hit, a player rolls their weapon damage, AKA **Damage Roll** to calculate a final **Damage Sum**. On *melee attacks only*, players will also add their Strength modifier *once* to the final Damage Sum.

`Player makes an melee attack roll of 15 against an armor rating of 5 for 3 successful attacks. Their melee damage is 3 and their strength modifier is 2. So the final damage is 3 + 3 + 3 + 2 for 11 total.`

Damage typically is subtracted from the target's health. However, the ZM may occasionally decide the the target instead loses some other resource, such as Sanity or Energy.

<br />

### Weapon Range ###

Most weapons have a range specified on it. Typically this means a weapon can only attack targets within X number of squares. This is better pictured by drawing a circle around the attacker with a radius equal to the range. Anyone within that circle is within range.

Attacking outside the range can either be impossible or incur a penalty or increase the targets Armor Rating, all at the ZM's discretion.

<br/>

### Unarmed Attacks ###

Characters can make attacks without a weapon. A base unarmed attack by a human deals 1 flat damage but costs no weapon durability. The attack still consumes energy.


<br/><br/>

## Fighting the Infected ##

Some special rules apply when fighting Infect. Most Infected, unless specified, do not roll initiative and instead will have their turn at the very end of the round *after* all other characters have had their turn. This will signify the end of the round. 

If an Infected manages to attack a target, and the target fails or does not dodge, they will receive damage and be grabbed by the Infected. **Regardless of the target's armor rating**, the Infected attack will always have 1 successful hit.

<br/>

### Grappling ###

If grabbed by an Infected, a character begins **grappling**. Picture a zombie inches from your face, jaws snapping at your flesh while you're holding them back for dear life. That is a grappling state.

When grabbed, the target can make no other action *except* to attempt to break the grab with a Strength active roll against the Infected's Strength roll. If the target exceeds the Infected's roll, they will break the grab. *Breaking a grab is considered 1 action*. However, characters only get one shot at breaking a grab. ***You cannot repeat a Breaking a Grab action on a turn***.

Multiple Infected may grab you. In that case, the Infected's Strength rolls are added onto each other.

If a character *does not* break the grab, then they are in trouble and better hope someone else frees them. Another character can break the grab by making a successful attack against the grabbing Infected, though low damage attacks may not be enough to remove its death grip.

If a player *remains* grabbed by the end of the round, then they will be bit. A bite from an Infected will deal massive damage ***and*** spreads the Infection. If the Infection enters the bloodstream, it is a death sentence for any human survivor - there is no known cure for the Infection.


<br/>

### Don't Get Surrounded ###

You may only grapple with Infected that are in front of you. If you are attacked by an Infected ***from both behind and in front*** (A Infected on one direction and another on the *opposite* side of the target, or flanking in D&D terms), then you will be bitten by the rear attacking Infected. 

Avoid being surrounded at all costs.



