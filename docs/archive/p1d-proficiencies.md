---
layout: page
title: Proficiencies
hierarchy: child
---


## Proficiencies ##

Proficiencies are activities that your character has expertise in. When you attempt that activity, you can add your proficiency bonus to any roll. 

Proficiencies are skills that generally every person is capable of or can do. You do not need to have any points in that proficiency in order to attempt it. However, having a point in it makes you perform that activity better.

<br /><br />

| Proficiency | Description |
| ---------------------- | ----------------------------- | 
{% for prof in site.data.fields.proficiencies -%}
| {{prof.display_name}} | {{prof.description}}         |
{% endfor -%}




