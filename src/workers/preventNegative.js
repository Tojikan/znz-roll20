
/**
 * Prevent certain fields from becoming negative.
 * @param {arr} fields 
 */
export function preventNegative(fields){

    for (let fld of fields){
        on(`change:${fld}`, function(){
    
            getAttrs([fld], function(values){
                let val = parseInt(values[fld], 10);
    
    
                if (isNaN(val)){
                    console.error('Error when parsing value when preventing negative');
                    return;
                }
    
                if (val < 0) {
                    const attrSet = {
                        [fld]: 0
                    }
    
                    setAttrs(attrSet);
                }
            });
        });
    }
}