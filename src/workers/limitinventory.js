import {fields as character} from '../model/character';


export function limit(){
    on('change:repeating_inventory', function(evInfo){
        console.log(evInfo);

        //So we don't interfere with unequip script
        if (evInfo.sourceType == 'sheetworker'){
            return;
        }


        getAttrs([character.inventory.id], function(values){
            let slots = parseInt(values[character.inventory.id], 10);

            if (isNaN(slots)){
                console.error('Error when parsing slots');
                return;
            }

            getSectionIDs("inventory", function(arr){

                if (arr.length > slots){
                    let lastRow = arr[arr.length - 1]; //only remove the latest one, so we don't interfere with unequip
                    removeRepeatingRow("repeating_inventory_" + lastRow);
                }
            });
        });
    });
}