---
layout: page
title: Abilities & Flaws
hierarchy: child
---


## Abilities and Flaws ##


### Abilities ###

Abilities are unique actions or traits that a character can have. Abilities might give them an additional action or provide some effect that aids in their survival. Each character begins with 1 ability. They can opt for 1 additional ability by agreeing to take on 1 more flaw.
<br /><br />

| Ability | Description |
| ---------------------- | ----------------------------- | 
{% for ability in site.data.quirks.abilities -%}
    {% if ability.value != "none" -%}
    | {{ability.name}} | {{ability.description}}         |
    {% endif -%}
{% endfor %}
<br /><br />


### Flaws ###

Flaws are characteristics with a negative affect on your character. These flaws may cause issues, lead the character into trouble, or force them to scavenge for specific resources. Flaws are randomized using a random roll (Randomize Flaw button in the character sheet). Players all start with 1 flaw.

If a player's sanity ever hits 0, they are traumatized and must randomize a new flaw. 
<br /><br />

| Flaw | Description |
| ---------------------- | ----------------------------- | 
{% for flaw in site.data.quirks.flaws -%}
    {% if flaw.value != "none" -%}
    | {{flaw.name}} | {{flaw.description}}         |
    {% endif -%}
{% endfor %}
<br /><br />