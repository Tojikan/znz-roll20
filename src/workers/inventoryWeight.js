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

        return result;
    })
    ]]));
    const customCounterFlds = (([[ transformData('items', (data)=>{
        var result = [];

        for (let i = 0; i < data.customCounters.inv_custom_count; i++){
            result.push(data.customCounters.inv_attr + "_" + i);
        }

        return result;
    })
    ]]));
    const customCounterWeights = customCounterFlds.map((x)=>{return x + "_total_weight"});
    const standardCounterWeight = (([[getProperty('items.inventoryCounterWeight')]]));
    const allCounterWeights = counterFlds.concat(customCounterWeights);

    // Repeating Sum for Inventory Weights
    // Get the sum of weights in the repeater.
    on('change:repeating_inventory:' + itemWeight + ' change:repeating_inventory:' + itemQuantity +' remove:repeating_inventory', function(evInfo) {
        repeatingSum(repeaterWeight,"inventory",[itemWeight, itemQuantity]);
    });

    // Custom Counters: Calculate total weight of a single counter
    for (let fld of customCounterFlds){
        let fldWeight = fld + "_weight";
        let fldTotal = fld + "_total_weight";
        on(`change:${fld} change:${fldWeight}`, function(){
            getAttrs([fld, fldWeight], function(values){
                var setAttr = {};

                let quantity = parseInt(values[fld], 0);
                let weight = parseFloat(values[fldWeight]);


                if (!Number.isNaN(quantity) && !Number.isNaN(weight)){
                    setAttr[fldTotal] = weight * quantity;
                } else {
                    setAttr[fldTotal] = 0;
                }
                setAttrs(setAttr);
            });
        });
    }

    // Get combined weight of all counters
    const calculateCounterWeight = function(){
        getAttrs(allCounterWeights, function(values){
            var setAttr = {};
            var weight = 0;


            //First calculate non-custom
            //Non-custom all have same weight, so we just need to get a sum of all quantities.
            var count = 0;
            for (let fld of counterFlds){
                let quantity = parseInt(values[fld], 0);

                if (Number.isInteger(quantity) && quantity > 0){
                    count += quantity;
                }
            }
            weight = count * standardCounterWeight;

            //Then calculate the custom
            for (let fld of customCounterWeights){
                let val = parseFloat(values[fld], 0);
                
                if (!Number.isNaN(val) && val > 0){
                    weight += val;
                }
            }

            setAttr[counterWeight] = Math.round(weight * 10) / 10;

            setAttrs(setAttr);
        });
    };

    for (let fld of allCounterWeights){
        on('change:' + fld, calculateCounterWeight);
    }


    // Set the final combined inventory weight - repeater + counters
    on(`change:${repeaterWeight} change:${counterWeight}`, function(){
        getAttrs([repeaterWeight, counterWeight], function(values){
            var setAttr = {};
            var combined = 0;

            combined += parseFloat(values[repeaterWeight]);
            combined += parseFloat(values[counterWeight]);

            setAttr[totalWeight] = combined;

            setAttrs(setAttr);
        });
    });

})();