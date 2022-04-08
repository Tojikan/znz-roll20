
/**
 * Prevent certain fields from falling beneath a value
 * @param {arr} fields 
 * @param {number} value
 */
export function preventValue(fields, value=0){

    for (let fld of fields){
        on(`change:${fld}`, function(){
    
            getAttrs([fld], function(values){
                let val = parseInt(values[fld], 10);
    
    
                if (isNaN(val)){
                    console.error('Error when parsing value when preventing value');
                    return;
                }
    
                if (val < value) {
                    const attrSet = {
                        [fld]: value
                    }
    
                    setAttrs(attrSet);
                }
            });
        });
    }
}