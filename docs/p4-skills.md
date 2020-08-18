---
layout: page
title: Skills
hierarchy: child
---


## Skills ##

Skills are areas of expertise and activities that your character has background knowledge or some level of training in. Skills enable your character to make actions that other characters without that skill could not do or to assist with a specific action. During character creation and character growth, you can assign points to skills to improve your knowledge any familiarity with that skill.

Characters **must** have at least one point in the skill in order to attempt that skill in an action.
<br /><br /><br />

| Skill | Description |
| ---------------------- | ----------------------------- | 
{% for skill in site.data.fields.skills -%}
| {{skill.display_name}} | {{skill.description}}         |
{% endfor -%}




