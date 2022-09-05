---
layout: page
title: Flaws
---


# Flaws #

Your character may start with a Flaw or obtain one during the campaign. These represent negative characteristics that may get your character int rouble.

<br/><br/>


## Flaws ##

{%- for fl in site.data.flaws %}
### {{fl.label}} ###

{{fl.tip}}

{%- endfor %}

