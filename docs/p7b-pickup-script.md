---
layout: page
title: Pickup Script
hierarchy: child
---

## Pickup Script ##

The pickup script provides a simple way to add an item to your inventory through a chat message. The script is triggered by typing to the chat:

`!!pickup`

By itself, this does nothing. Additional parameters must be added to this script as well in order to add an item.


### Parameters ###

Parameters can be added by adding to the pickup command:

`!!pickup name=item`

The following would add an item named "item" to your inventory.

Parameters are denoted in [field]=[value] where everything to the left of the equal sign is the field that you are appending to and everything to the right will be the value of the field for the added item.

Parameters are separated by spaces. Therefore, there cannot be any spaces in your parameter.

This is not valid:

`!!pickup name = item`

This is valid:

`!!pickup name=item`


If there are spaces in the value, you can wrap it with single or double quotes.

This is valid:

`!!pickup name="this is an item name" weight=3 quantity=2` 

`!!pickup name='this is an item name' weight=5`


### Available Parameters ###

{% for field in site.data.itemfield-shorthand.args -%}
- **{{field.name}}**: {{field.hint}} 
{% endfor -%}




### Templates ###

A key function of the pickup script is to add an item with pre-written fields. These are called templates and allow you to quickly pick up a pre-generated item.

Add a template by this parameter

`!!pickup item=blunt1`

This will add the 'blunt1' template to your inventory. You can then add other parameters as normal to override the template fields.

`!!pickup item=blunt1 name="Real name"`

This will add a blunt1 template item with the name "Real name"


### Available Templates ###

**Weapons**

{% for item in site.data.items-weapon -%}
{% if item[0] != '$schema' -%}
- **{{ item[0] }}** - {{ item[1].description }}
{% endif -%}
{% endfor -%}

<br>


**Armor**

{% for item in site.data.items-armor -%}
{% if item[0] != '$schema' -%}
- **{{ item[0] }}** - {{ item[1].description }}
{% endif -%}
{% endfor -%}
<br>

**Misc**

{% for item in site.data.items-misc -%}
{% if item[0] != '$schema' -%}
- **{{ item[0] }}** - {{ item[1].item_effect }}
{% endif -%}
{% endfor -%}
<br>
