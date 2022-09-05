---
layout: page
title: Abilities
---


# Abilities #

When building your character, you can gain up to 3 abilities. Abilities must be purchased with XP.

<br/><br/>


## Abilities ##

{%- for ab in site.data.abilities %}
### {{ab.label}} ###

{% for lev in ab.levels %}
{{forloop.index}}. **{{lev.label}}**
<br/>
{{lev.tip}}
{% endfor %}

<br/>
{%- endfor %}

