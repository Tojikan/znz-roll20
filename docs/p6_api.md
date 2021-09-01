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



