---
layout: page
title: Attributes
hierarchy: child
---


## Attributes ##

Attributes are the physical and mental characteristics of the player. Each attribute measures one specific innate aspect of the character. These attributes are used to help character complete a certain action or pass a check. Players can assign points during creation to any of the available attributes.

The base value for every attribute is 3. **This number represents an average human ability**. 

All attributes max at at **6**.
<br/><br/>

### Attribute Modifier ###

Every point in an attribute above the base 3 confers a **bonus** to that attribute whereas every point below the 3 confers a **penalty**. This bonus/penalty is referred to as a **modifier**. The modifier is the number that gets used when adding an attribute to the roll. 

Example:

``` A Player has a Strength Score of 5, which gives them a modifier of +2. The player makes a melee attack which allows them to add strength to the attack roll. They roll a 5 and then add 2 for their strength for a total of 7. ```

``` A Player has a Tenacity Score of 2, which gives them a modifier of -1. The player makes a tenacity check upon seeing a pile of rotting corpses. They roll a 5 and then subtract 1 for their Tenacity modifier resulting in a 4.```
<br/><br/>


### Attribute Descriptions ###

{% for attr in site.data.fields.attributes %}

**{{attr.display_name}}**

{{attr.description}}
<br/>

{% endfor %}
