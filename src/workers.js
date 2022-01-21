import { CharacterModel } from "./data/character";
import { ItemModel } from "./data/item";
import { objToArray } from "./lib/znzlib";
import { deleteRepeaterItem } from "./workers/deleteRepeaterItem";
import { limitRepeater } from "./workers/limitRepeater";
import { preventValue } from "./workers/preventValue";
import { slotEquip } from "./workers/slotEquip";
import { randomize } from "./workers/randomize";


deleteRepeaterItem(CharacterModel.inventory.key, 'delete');
limitRepeater(CharacterModel.inventory.key, CharacterModel.inventoryslots.key);
slotEquip(ItemModel);



let attrs = objToArray(CharacterModel.attributes).map(x => x.key);
preventValue(attrs, 1);

let nonneg = [];
nonneg.push(CharacterModel.rollcost);
nonneg.push(CharacterModel.resources.fatigue);
nonneg = nonneg.concat(objToArray(CharacterModel.ammo.list));
nonneg = nonneg.map(x => x.key);

preventValue(nonneg);


for (let i = 0; i < CharacterModel.flaws.count; i++){
    randomize(`randomize_${CharacterModel.flaws.selected.key}_${i}`, `${CharacterModel.flaws.selected.key}_${i}`, CharacterModel.flaws.options.map(x => x.key));
}

