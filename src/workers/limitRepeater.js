

/**
 * Limits a repeater to X elements
 * @param {*} repeaterAttr - Attribute for repeater
 * @param {*} limitAttr - Attribute for the field to determine limit
 */
export function limitRepeater(repeaterAttr, limitAttr){
    on(`change:repeating_${repeaterAttr}`, function(evInfo){

        //So we don't interfere with unequip script
        if (evInfo.sourceType == 'sheetworker'){
            return;
        }


        getAttrs([repeaterAttr, limitAttr], function(values){
            let slots = parseInt(values[limitAttr], 10);


            if (isNaN(slots)){
                console.error('Error when parsing slots');
                return;
            }

            getSectionIDs(repeaterAttr, function(arr){

                if (arr.length > slots){
                    let lastRow = arr[arr.length - 1]; //only remove the latest one, so we don't interfere with unequip
                    removeRepeatingRow(`repeating_${repeaterAttr}_` + lastRow);
                }
            });
        });
    });
}