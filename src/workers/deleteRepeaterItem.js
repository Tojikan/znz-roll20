import { getButtonRowId } from "../lib/roll20lib";

/**
 * Delete Repeating Row on button click
 * @param {*} repeaterAttr - Repeating Row Attr
 * @param {*} deleteAct  - button action.
 */
export function deleteRepeaterItem(repeaterAttr, deleteAct='delete'){
    on(`clicked:repeating_${repeaterAttr}:${deleteAct}`, function(evInfo){
        const rowId = getButtonRowId(evInfo);
        removeRepeatingRow(rowId);
    });
}