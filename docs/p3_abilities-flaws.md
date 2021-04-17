---
layout: page
title: Abilities & Flaws
---


# Abilities and Flaws #

Characters can gain unique Abilities that give them powerful actions or effects. At the same time, characters can also have Flaws, which are negative effects that can lead you into trouble.

### Abilities ###

Abilities are unique actions or traits that a character can have. For example, Abilities might give characters an additional action or new types of attacks. Each character begins with 1 ability. They can opt for one additional ability by agreeing to take on 1 more flaw.
<br /><br />

<table>
    <thead>
        <tr>
        <th>Ability</th>
        <th>Description</th>
        </tr>
    </thead>
    <tbody>
{% for ability in site.data.abilities -%}
    {% if ability.value != "none" %}
        <tr>
            <td>{{ability.name}}</td>
            <td>{{ability.description}}
                <ol>
                    <li>{{ability.lvl1}}</li>
                    <li>{{ability.lvl2}}</li>
                    <li>{{ability.lvl3}}</li>
                </ol>
            </td>
        </tr>
    {% endif -%}
{% endfor %}
    </tbody>
</table>
<br /><br /><br>


### Flaws ###

Flaws are characteristics with a negative affect on your character. These flaws may cause issues, lead the character into trouble, or force them to look for specific resources. Flaws are randomized using a random roll (Randomize Flaw button in the character sheet). Players all start with 1 flaw.

If a player's sanity ever hits 0, they are traumatized and may randomize a new flaw. 

<br/><br/>

| Flaw | Description |
| ---- | ----------- |
{% for flaw in site.data.flaws -%}
{% if flaw.value != "" %}| {{flaw.name}} | {{flaw.description}} |{% endif %}
{% endfor %}
<br /><br />