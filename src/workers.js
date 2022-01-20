import { CharacterModel } from "./data/character";
import { ItemModel } from "./data/item";
import { objToArray } from "./lib/znzlib";
import { deleteRepeaterItem } from "./workers/deleteRepeaterItem";
import { limitRepeater } from "./workers/limitRepeater";
import { preventNegative } from "./workers/preventNegative";
import { slotEquip } from "./workers/slotEquip";


deleteRepeaterItem(CharacterModel.inventory.key, 'delete');
limitRepeater(CharacterModel.inventory.key, CharacterModel.inventoryslots.key);
slotEquip(ItemModel);



let attrs = objToArray(CharacterModel.attributes);
attrs.push(CharacterModel.rollcost);
attrs = attrs.concat(objToArray(CharacterModel.ammo.list));

let nonneg = attrs.map(x => x.key);
preventNegative(nonneg);