---
layout: page
title: Combat
---

## Combat ##

Combat encounters form a major part of this game. As most games, ZnZ combat is turn-based combat where players go in order of their initiative. 



### Initiative ###

A combat encounter begins with all players rolling initiative which is a flat D10 roll. Initiative is tracked in the Roll20 Turn Tracker.

Players can roll initiative directly into the tracker by using the Initiative Macro (see [Scripts]({{site.baseurl}}/p7-scripts-macros.html) ). 

Players go in order of their initiative.
<br/><br/>

### Rounds ###

A combat round ends once all players have completed their turns. When a round ends, all undead enemies will then begin their actions and resolve their movement and attacks.


When a new round begins, the initiative order resets. In addition, the ZM will add more to the final **Combat Burden**.

<br/><br/>

### Combat Burden ###

Fighting is stressful and taxing and wears down a person's mental and physical faculties. As the adrenaline begins to wear off after a hard-fought battle, people begin to feel the true burden of the fight and their resources(usually sanity or energy) are taxed depending on the duration and intensity of the fight.

Each round of combat adds to the final combat burden. Players must therefore balance between spending resources to finish combat early to reduce the tax or carefully measuring resource usage at the risk of a higher combat burden. 

Combat burdens are subtracted *after* combat is finished so there is no negative consequence for combat burdens during the fight.

Examples:

``` The party goes through 4 rounds of regular-paced combat. The cost of each round was 2 sanity, meaning each player must reduce sanity by 8 after combat ends ```

``` The party goes through 2 rounds of fast-paced combat where players are fighting while running for their lives. The cost of each round was 3 energy and 3 sanity, meaning each player must reduce energy and sanity by 6 after combat ends ```
<br/><br/>

### Actions ###

When it is a player's turn, they can take up to **2 Actions**. Available actions include:

- Firing a weapon or making a melee attack
- Moving their move speed to a target location. This includes traversing over an obstacle, such as climbing over a barricade.
- Reloading a weapon
- Equipping a new weapon from the inventory.
- Preparing to Dodge against an attack.
- Recover from a knockback or prone position.
- Use a character or equipment ability.
- Make a reaction trigger for a specific event occurring.
- Doing any sort of skill or attribute check.

Once a player does an action, they cannot repeat it again that turn (such as moving twice or attacking twice) **unless** they spend an additional **2 energy** to repeat it.

If you have an action remaining at the end of your turn, you will automatically Prepare to Doge.

``` A player moves and attacks an enemy for a total of 2 actions. Their turn ends. ```

``` A player moves and then moves again to sprint away from danger. They must spend 2 energy to do so. ```

``` A player moves and then prepares to dodge. Their turn ends and they are ready to dodge an enemy attack. ```
<br/><br/>

### Free Actions ###

In addition, Players get a single Free Action on their turn. Free actions are basic actions that include:

- Shouting, Whispering, or saying something.
- An perception check to spot something in the environment.
<br/><br/>


### Attacking ###

Players can make ranged, melee, or unarmed attacks. When players attack, they specify the **number of attacks** they wish to make (for melee attacks, you can see this as just hitting really hard as opposed to hitting multiple times). Then the player rolls a **Hit Roll** for each attack they decided to make. The hit roll is determined in the character sheet and defaults to D10. Having a higher hit roll improves your chance to land a critical strike.


The results of the Hit Roll decides if the attack will hit. Each roll will have a challenge level that the roll must beat in order for the attack to hit (see below for general guidelines on how the challenge level is determined). Additionally, players can add on attributes (*Strength for melee; Dexterity for ranged*) and any weapon proficiencies to reduce this challenge level.

If the Hit Roll beats the challenge, then the attack succeeds and the player rolls a **Damage Roll** based on the weapon damage of their equipped melee/ranged weapon.  All damage from all successful Hits is added up to arrive at a final damage figure.

Players must spend a resource for each attack. Melee attacks consume Energy and Ranged attacks consume Ammo.

If a player rolls a natural 1 on the attack roll, the attack automatically fails. On a melee attack, the weapon's durability is reduced by 1. If the durability drops to 0, the weapon breaks and cannot be used again. 

If the player rolls a natural *10 or higher* on the roll, then the attack *critically strikes*. During a critical strike, the amount of times the damage roll is made is multiplied based on the weapon's crit bonus stat (i.e. 1d10 can become 3d10 if the crit bonus is a 2). 

Please see the [Weapon Fields]({{site.baseurl}}/p4a-weapon-fields.html) page for more detailed information on the various weapon fields and what they represent.


Examples: 

``` A player does a ranged attack with 3 attacks. The first attacks rolls a 6 against a challenge of 5, which is reduced by the player's dexterity(+1) and weapon proficiency(+1) to 3. The attack succeeds and the player rolls a damage of 2. The second attack is a 3 against 6, which fails, and the third attack is a 9 against a challenge of 4, which succeeds for a damage of 5. The total damage dealt is 7 (2+5). The player spends 3 ammo.```

``` A player makes a melee attack with 2 attacks. One attack succeeds and one attack was a natural 1. That attack fails and their melee weapon loses 1 durability. They roll the damage dice for the successful attack to determine damage. Then the player spends 2 energy.  ```

``` A player does a ranged attack with 3 attacks. 2 of those attacks miss and 1 attack critically strikes. Normally the player rolls the weapon damage once, but since it is a crit, they roll the damage 3 times since the weapon had a Crit Bonus of 2 (add 2 rolls on top of the regular roll). They spend 3 ammo. ```

<br/><br/>

### Attack Script ###

If the above sounds complicated, that's probably because it is. Fortunately, if you're on Roll20, you can use the built-in attack script to automatically calculate attacks. If the macro button is enabled, you can simply click on the macro button once your character is selected. A pop-up window will appear allowing you to enter the number of attacks you would like to make, the difficulty level of the attack (Easy, Medium, etc), and any bonuses to add on to your hit roll. 

The script will automatically calculate the results of your attack, subtracts the necessary resources, and outputs the attack results into the chat.

Please see the [Attack Script]({{site.baseurl}}/p7a-attack-script.html) page for more details.
<br/><br/>


### Determining Challenge Levels ###

Unless directly instructed by the ZM, challenge levels can be determined based on your weapon range or movement prior to a melee attack. However, in general, attacks will default to Medium challenge.
<br/><br/>


**Ranged Attack Challenge**

Ranged weapons all have a Weapon Range field consists of two numbers (looking like ` 5 / 10 `). These numbers determine from how many squares away you can launch your ranged attack. This first number is the **Effective Range** of your weapon (5) and the second is the **Max Range** of your weapon (10). Effective refers to being able to hit the target reliably and Max Range is the conceivable ability for a marksman to purposefully hit the target.

In general:

- If your character is in point-blank range (1 space away) of the target, the attack will be an **Easy** challenge.
- If your character is within the effective range, the attack will be a **Medium** challenge.
- If your character is outside the effective range but within the max range, the attack will be a **Hard** challenge.
- If your character is outside of the max range, the attack will be an **Insane** or **Impossible** challenge.
<br/><br/>


**Melee Attack Challenge**

Melee Attacks often involve moving some number of spaces to get close enough to a target in order to hit them. Melee attack difficulty can be determined by *the number of spaces a player moved to reach a particular target to melee them*.

In general:

- If your character did not move prior to the melee attack and started from a standing position, the attack will be an **Easy** challenge.
- If your character moved 1-3 spaces prior to the melee attack, the attack will be a **Medium** challenge.
- If your character moved 4-5 spaces prior to the melee attack, the attack will be a **Hard** challenge.
- If your character moved 5+ spaces, or had to do special movement around an obstacle, or stand from a prone position, the attack will be a **Insane** or **Difficulty** challenge.


**Note**

The above isn't meant to be conclusive. The ZM can decide a challenge level at will. The above challenges are determined based on common enemies and may not apply to all enemies

<br/><br/>


### Unarmed Attacks ###

An unarmed attacks functions similarly to a melee attack but a melee attack will only deal 1 flat damage without any rolling.

<br/><br/>



### Infected Round ###

At the end of the round, all combat with the Infected are resolved. See [Fighting the Infected]({{site.baseurl}}/p4b-infected-combat.html)

























