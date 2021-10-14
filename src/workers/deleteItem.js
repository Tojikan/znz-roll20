import { fields as character } from '../model/character';
import { options } from '../model/card';
import { getButtonRowId } from './_helpers';

export function deleteItem(){
    on(`clicked:repeating_${character.inventory.id}:${options.actions.delete}`, function(evInfo){
        const rowId = getButtonRowId(evInfo);
        removeRepeatingRow(rowId);
    });
}