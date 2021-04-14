(function() {

    const totalWeight = "(([[getProperty('misc.total_weight.attr_name')]]))";
    const repeaterWeight = "(([[getProperty('misc.inventory_weight.attr_name')]]))";
    const counterWeight = "(([[getProperty('misc.counter_weight.attr_name')]]))";
    const itemWeight = "(([[getProperty('prefixes.inventory')]]))_(([[getProperty('items.fields.weight.attr_name')]]))";
    const itemQuantity = "(([[getProperty('prefixes.inventory')]]))_(([[getProperty('items.fields.quantity.attr_name')]]))";
    const counterFlds = (([[ transformData('items', (data)=>{
        var result = [];

        for (let count of data.inventoryCounters){
            result.push(count.attr_name);
        }

        for (let i = 0; i < data.customCounters.inv_custom_count; i++){
            result.push(data.customCounters.inv_label + "_" + i);
        }

        return result;
    })
    ]]));
    const individualCountWeight = (([[getProperty('items.inventoryCounterWeight')]]));

    // Repeating Sum of inventory weight
    on('change:repeating_inventory:' + itemWeight + ' change:repeating_inventory:' + itemQuantity +' remove:repeating_inventory', function(evInfo) {
        repeatingSum(repeaterWeight,"inventory",[itemWeight, itemQuantity]);
    });

    // Counter Flds
    for (let fld of counterFlds){
        on('change:' + fld, function(){
            getAttrs(counterFlds, function(values){
                var setAttr = {};
                var count = 0;
                for (let fld of counterFlds){
                    let val = filterInt(values[fld]);
                    
                    //prevent decimals
                    if (!Number.isInteger(values[fld])){
                        setAttr[fld] = Math.round(values[fld]);
                    }

                    if (Number.isInteger(val)){
                        count += val;
                    } else {
                        setAttr[fld] = 0;
                    }

                }
                var weight = Math.round(count * individualCountWeight);
                setAttr[counterWeight] = weight;
                setAttrs(setAttr);
            });
        });
    }

    // Combined
    on(`change:${repeaterWeight} change:${counterWeight}`, function(){
        getAttrs([repeaterWeight, counterWeight], function(values){
            var setAttr = {};
            var combined = 0;

            combined += filterInt(values[repeaterWeight]);
            combined += filterInt(values[counterWeight]);

            setAttr[totalWeight] = combined;

            setAttrs(setAttr);
        });
    });



})();