# APIs #


## Deck ##


`!!deck` - API

Used for handling loot and drawing and stuff. Deck is an array of item key names.


**Commands**

`draw` - Draws 1 card from top of deck.


`add={item}` - Adds 1 card randomly in the deck. Should pass in item key.

`remove={item}` - Removes first occurrence of a card from the top of deck. Should pass in item key.

`shuffle` - reshuffle current deck

`reset` - Reset deck to base



## Pickup ##

`!!pickup`

`!!pickup item={itemkey}`

**Args**

`name`

`type` - weapon, equipment, inventory

`description`

`flavor`

`weapontype` - melee, ranged

`uses`

`damage`




## Reload ##

`!!reload`

`!!reload weapon=1` - weapon is integer referring to the weapon slot to reload.